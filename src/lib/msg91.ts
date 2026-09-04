
declare global {
  interface Window {
    configuration?: Record<string, unknown>;
    initSendOTP?: (config: Record<string, unknown>) => void;
    sendOtp?: (
      identifier: string,
      success?: (data: unknown) => void,
      failure?: (err: unknown) => void
    ) => void;
    retryOtp?: (
      channel?: unknown,
      success?: (data: unknown) => void,
      failure?: (err: unknown) => void
    ) => void;
    verifyOtp?: (
      otp: string | number,
      success?: (data: unknown) => void,
      failure?: (err: unknown) => void,
      token?: unknown
    ) => void;
  }
}

const MSG91_SCRIPT_URLS = [
  "https://verify.msg91.com/otp-provider.js",
  "https://verify.phone91.com/otp-provider.js",
];

const DEFAULT_WIDGET_ID = "366962684349333934343434";
const DEFAULT_TOKEN_AUTH = "562956TUrqpm6EE6a894982P1";

export function getMsg91Config(identifier?: string): Record<string, unknown> {
  const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || DEFAULT_WIDGET_ID;
  const tokenAuth = process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || DEFAULT_TOKEN_AUTH;

  if (typeof document !== "undefined") {
    let captchaEl = document.getElementById("msg91-captcha");
    if (!captchaEl) {
      captchaEl = document.createElement("div");
      captchaEl.id = "msg91-captcha";
      document.body.appendChild(captchaEl);
    }
  }

  const config: Record<string, unknown> = {
    widgetId,
    tokenAuth,
    exposeMethods: true,
    captchaRenderId: "msg91-captcha",
    success: (data: unknown) => {
      console.log("[MSG91 Global Success Callback]:", data);
    },
    failure: (error: unknown) => {
      console.error("[MSG91 Global Failure Callback]:", error);
    },
  };

  if (identifier) {
    config.identifier = identifier;
  }

  return config;
}

export function loadMsg91Script(identifier?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return resolve();
    }

    const config = getMsg91Config(identifier);
    window.configuration = config;

    if (typeof window.sendOtp === "function") {
      return resolve();
    }

    let urlIndex = 0;

    function attemptLoad() {
      const currentUrl = MSG91_SCRIPT_URLS[urlIndex];
      const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${currentUrl}"]`);

      if (existingScript) {
        if (existingScript.dataset.loaded === "true" && typeof window.initSendOTP === "function") {
          try {
            window.initSendOTP(window.configuration || config);
          } catch (e) {
            console.warn("[MSG91] initSendOTP warning on existing script:", e);
          }
          return resolve();
        }
        existingScript.addEventListener("load", () => {
          if (typeof window.initSendOTP === "function") {
            try {
              window.initSendOTP(window.configuration || config);
            } catch (e) {
              console.warn("[MSG91] initSendOTP warning on script load:", e);
            }
          }
          resolve();
        }, { once: true });
        existingScript.addEventListener("error", () => {
          urlIndex++;
          if (urlIndex < MSG91_SCRIPT_URLS.length) {
            attemptLoad();
          } else {
            reject(new Error("Failed to load MSG91 script from all available sources."));
          }
        }, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = currentUrl;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = "true";
        if (typeof window.initSendOTP === "function") {
          try {
            window.initSendOTP(window.configuration || config);
          } catch (e) {
            console.warn("[MSG91] initSendOTP error during script.onload:", e);
          }
        }
        resolve();
      };
      script.onerror = () => {
        urlIndex++;
        if (urlIndex < MSG91_SCRIPT_URLS.length) {
          attemptLoad();
        } else {
          reject(new Error("Failed to load MSG91 script from all available sources."));
        }
      };
      document.head.appendChild(script);
    }

    attemptLoad();
  });
}

function waitForSendOtp(timeoutMs = 4000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.sendOtp === "function") {
      return resolve();
    }

    const start = Date.now();
    const interval = setInterval(() => {
      if (typeof window.sendOtp === "function") {
        clearInterval(interval);
        return resolve();
      }

      if (typeof window.initSendOTP === "function" && window.configuration) {
        try {
          window.initSendOTP(window.configuration);
        } catch {

        }
      }

      if (Date.now() - start >= timeoutMs) {
        clearInterval(interval);
        if (typeof window.sendOtp === "function") {
          return resolve();
        }
        return reject(new Error("MSG91 sendOtp is not available. Please verify widget configuration."));
      }
    }, 100);
  });
}

let isWidgetInitialized = false;

export async function initMsg91Widget(identifier?: string): Promise<void> {
  if (typeof window === "undefined") return;

  if (isWidgetInitialized && typeof window.sendOtp === "function") {
    return;
  }

  const config = getMsg91Config(identifier);
  window.configuration = config;

  await loadMsg91Script(identifier);

  if (typeof window.initSendOTP === "function" && !isWidgetInitialized) {
    try {
      window.initSendOTP(config);
      isWidgetInitialized = true;
    } catch (e) {
      console.warn("[MSG91] initSendOTP call warning:", e);
    }
  }

  await waitForSendOtp(4000);
  isWidgetInitialized = true;
}

export async function sendMsg91Otp(phone: string): Promise<unknown> {
  const cleanPhone = phone.replace(/[^\d]/g, "");

  if (typeof window === "undefined" || typeof window.sendOtp !== "function") {
    await initMsg91Widget(cleanPhone);
  }

  return new Promise((resolve, reject) => {
    if (typeof window.sendOtp !== "function") {
      return reject(new Error("MSG91 sendOtp is not available. Please verify widget configuration."));
    }

    console.log("[MSG91] Invoking sendOtp for identifier:", cleanPhone);

    window.sendOtp(
      cleanPhone,
      (data: unknown) => {
        console.log("[MSG91 sendOtp Success]:", data);
        resolve(data);
      },
      (error: unknown) => {
        console.error("[MSG91 sendOtp Error]:", error);
        reject(error);
      }
    );
  });
}


export function retryMsg91Otp(channel?: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (typeof window.retryOtp !== "function") {
      return reject(new Error("MSG91 retryOtp is not available."));
    }

    try {
      const onSuccess = (data: unknown) => {
        console.log("[MSG91 retryOtp Success]:", data);
        resolve(data);
      };

      const onFailure = (error: unknown) => {
        console.error("[MSG91 retryOtp Error]:", error);
        reject(error);
      };

      if (channel !== undefined && channel !== null) {
        window.retryOtp(channel, onSuccess, onFailure);
      } else {
        try {
          (window.retryOtp as (s: typeof onSuccess, f: typeof onFailure) => void)(onSuccess, onFailure);
        } catch {
          window.retryOtp(null, onSuccess, onFailure);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function verifyMsg91Otp(otp: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window.verifyOtp !== "function") {
      return reject(new Error("MSG91 verifyOtp is not available."));
    }

    try {
      window.verifyOtp(
        otp.trim(),
        (data: unknown) => {
          console.log("[MSG91 verifyOtp Success]:", data);

          let token = "";
          if (typeof data === "string") {
            token = data;
          } else if (data && typeof data === "object") {
            const obj = data as Record<string, unknown>;
            const dataObj = obj.data as Record<string, unknown> | undefined;

            token =
              (obj.accessToken as string) ||
              (obj.token as string) ||
              (obj.jwt as string) ||
              (obj["access-token"] as string) ||
              (dataObj?.accessToken as string) ||
              (dataObj?.token as string) ||
              (typeof obj.message === "string" && obj.message.length > 30 ? obj.message : "") ||
              "";
          }

          if (token) {
            resolve(token);
          } else {
            const rawToken = typeof data === "object" ? JSON.stringify(data) : String(data);
            resolve(rawToken);
          }
        },
        (error: unknown) => {
          console.error("[MSG91 verifyOtp Error]:", error);
          reject(error);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

export function extractMsg91ErrorMessage(err: unknown): string {
  if (!err) return "Phone verification failed. Please try again.";
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === "string" && obj.message) return obj.message;
    if (typeof obj.description === "string" && obj.description) return obj.description;
    if (typeof obj.msg === "string" && obj.msg) return obj.msg;
    if (typeof obj.error === "string" && obj.error) return obj.error;
    if (obj.data && typeof obj.data === "object") {
      const dataObj = obj.data as Record<string, unknown>;
      if (typeof dataObj.message === "string") return dataObj.message;
    }
    if (typeof obj.data === "string" && obj.data) return obj.data;
  }
  return err instanceof Error ? err.message : "Phone verification failed. Please try again.";
}
