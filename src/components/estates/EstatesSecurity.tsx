'use client';

export default function EstatesSecurity() {
  const securityFeatures = [
    {
      id: 'spv',
      text: 'Ring-fenced ownership structure (SPV)',
      icon: (
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink">
          <rect width="45" height="45" fill="url(#pattern0_18_138)" />
          <defs>
            <pattern id="pattern0_18_138" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use href="#image0_18_138" transform="scale(0.0111111)" />
            </pattern>
            <image id="image0_18_138" width="90" height="90" preserveAspectRatio="none" href="data:image/png;base64,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" />
          </defs>
        </svg>

      ),
    },
    {
      id: 'escrow',
      text: 'Independent escrow and fund controls',
      icon: (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink">
          <rect width="38" height="38" fill="url(#pattern0_18_139)" />
          <defs>
            <pattern id="pattern0_18_139" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use href="#image0_18_139" transform="scale(0.0111111)" />
            </pattern>
            <image id="image0_18_139" width="90" height="90" preserveAspectRatio="none" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAHlklEQVR4nO2ca4hVVRTHf1o5zoehxHS0LM0Hahq+0lLM1BKKggIzom+9xiKI/BDRB19jVlAqWmJWBpWSGZUYIRL5IRCJwszSUCo0pYc6KknjTDn3xLZ1YRjO3nefs/d5jn9YMMy95+x1/mfftddejw0XcREXcRGFwEBgLrAM2ATsNnxXfbYRWCrXNKaoZ+FwCTATWAP8DAQhokPYdw8CrwLTgZ4pPkducZXMxN81hMUlurMcBZYA/emGuBbYAPxjQVTgSHRVzgFvAtfQDdAArADaIhAUeCK6Kq3ActGllLgDOByDmMAz0VX5DbiLEqGXLExRSOgA9gGvAfOBWYb7q8+ekO9+D1QijFMR3eooOAaJ+2X70F8ATUA/hzEb5eV8GYH0XUV2C0cCRyweUtnrdcCoBHQYJYtuu4UeyqyNoWCYABy3mMHvAUNS0Gcw8IEF2X8CYynQTK5F8i/AbRnoNtviV3a8CDN7kMWDfJixa3WFxew+nOcNTq8aC58yFc8BPbJWlP91WFRjsdyVV2/E5MKdBx4hf3hYXEmd3qvJGe6sMZN9kDwUmNdFfGw4HjXMbPX/OeQEDTXssjIXPtAUcu9fPd17YY2gVC626ytqLHw9CkB0D2CL4TlUbCTzKFybwYXzOROaEiRa4XLDL/NcSv6+FhsMts23n9yUMNGIzjp7/RYZBu118WS144uLPhp5OmScYwlkUDZrnkn9cgeQAZYaFHL5mQURpSIZmk+Bxz2YqyFiKsLGep4Mcny69JMKEJEi0UHIFvpeRx3eMHggqeYgZxpm16iMiQ5kE3K/gw6jDbZ6BilijUYJFU8mB0QHQAvQ10GPnZr7riVF6EoClGfgikBjjoZ2kRuB+4BPDLNP2ey4mK+55yFSLG7R/VxdMiNVhN37Rcx4THPdu8RHP0McRHGQOOZqBlc5PjIiWuGnkOs+ww37NPq42H9rLNMMrpKjWRK9I+S6tx11WavRp5kUsCkBe5jUjH4A/7tRJe+TAnTBfeXyZUX0kyHX7Acu9ZD6CtPna0qAwNLrmAY8CHwe8v0/gOs96HKdIdVVeAQO0i4lvCoO4wN9NeOcpAQIYsq/wLPAFM95UN0L7dYzOhDZK6bFFfWGwFnhEYTIt8D6LvKObPkPG2bdPY66XK259wlKgCCG1zFD4979JWTFxVhD9igz985U8Zk00QrDNTV2Kqfp270z9dR4w0bN4Kp0NkuiEVPS9dofiY8FCWSQrLEkp1twNKVeqsLf9y54MRkGlVQReNZE7/Ps826T2fuUFNKME5ufSqlYo4aMiqdi7iAm0fM0135FgXFI81AqWJ4m0ZdJmfALhvoSVYVUWOgKGlU7gyuCEDktWZ3OcqxGgWI1nXUlBcb0nCdnA9mSu25YMkdPSb2HPaCqXnJB4EFUKcTdlAQ6N69NekbiIogpFfF8npHKJh+ok41YsySBDwCnpEKrXf7eL58tlZi8d4+kv6GiR/mzcTFPI+s1rpuqkZ4qLRO+MEmKaM7EeOGnRdeJHvW50FutG1BtX4tW5DhRk3uMK9uB8b7Kdls1gxzxPMuaEiS6XtooznskufOivAro7arkcsMgWwpQiD7SUFbgU1SMfISLog3ywEHCcYGmBIi+Sex8kJKccM0A3V6j4cZHs9AtIcH/lxxJPpsiyVU560q2qf2tQ7qf8oKRKc/ksJkd24zUSRNkYJjZC3PQ0Fmfkk22sdmxF8hGi8NPtkhjTlZYbdDtb5kMwyQDPkw6bHWelausdHmQMXJKgGmAIwn42bZ+8nkDyTdrrpsakexKBNdPxbidkpo2x0hsTrmtbIdBn1rh1MWW5HXI4q8LUfiueL0ws23OUGqT7e5oksWkGnooM1Er+WtLchU2ZFfkfBPneIhpgew64E5JHvgoaLdtAKqKssm1FvsoJFeb+m3MyOs+HrBOFqAoh0p1SCRurWxUZsuM6yNZlXrJ3Y2VzxZIInWbQYczjjN6RAySayUmqnLK4kVbY44hhh14El0ZwCyLa5V3YcKShEiuyq14RIPk93Th1cBRVLY6DM0W17aKdxGGaRqvwxfJgbxI7xgsvdVxTnQMDKI7W2Or5fWt4l0Ml5/ycCHgXMIkK/mYBDFA2n6PeiJa55Me8PxCfZOs5AdSykHOkMXvoIOyuoLGkzknObMK1YHSYtYsjTnfSAVn53xdi5Qd7JZFcJF4JGFozznJpam5bvdARCWkkPMhTySXhuiWnJMcSMii8DiQU3OR+mKYNLamQLJriDVR9y7r03ICjyS7hlhTqbnO6iAXX+bCR4g11QNXkkKdVBAlZZNdQ6wtPoNKWWO9BcmVmAufa4jV9RyqXGFijOCOrXfhEmKt+CobyxO2RyA7igsXN8QayDFypcN4SYjakBclUREnxBqILjdQUqyKQGAUiRJircrLlBi9gT0JkR1FvpOUXKkxQsKSWZF83GIBLQ2mZFjkOJluhskWhT4+pcWwaNIdzMjeFEje053MhWmBXBnB9Ysi6p6v+GitKBPGSS1cFB9aJxXZjJTWT/aBCVKmdSqmHV5Xxm01CUJtPFT4Um08VGBeZUFURl3lIJWov1Xp2kfyHdX+ETsK9x/gIpi5QtHSmQAAAABJRU5ErkJggg==" />
          </defs>
        </svg>

      ),
    },
    {
      id: 'docs',
      text: 'Clear and enforceable legal documentation',
      icon: (
        <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink">
          <rect width="39" height="39" fill="url(#pattern0_18_140)" />
          <defs>
            <pattern id="pattern0_18_140" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use href="#image0_18_140" transform="scale(0.0111111)" />
            </pattern>
            <image id="image0_18_140" width="90" height="90" preserveAspectRatio="none" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADX0lEQVR4nO3dvWsUQRjH8W8Ek4hBfAkWkiqCYqFgYaNEsRAL/41YqGjKlF6n2HhtmvwHNhYqGhANIum0VRA1vjRWRj2DcI8cTJHibnfvdp6deebmBw8Ekt3sfLLM7s4+SSAnJycnJycnx1KmgSVgA/gFSMDaBl4BZ0gsc8DbwLjSp/4Al0joTI4RWVLDXooAU8YBeyMCSBkH7K0IEGVH/U4VWyKrhZIf/l/gCgYjkRWpYscInSR2rNDJYccMnRR27NDJYFuATgLbCrR5bEvQprGtQZvFtghtEtsqtDlsy9CmsK1Dm8FOAbqXixWWWIO+g5TI6ogi9joBI5HVcs3xFGH3ppBgkchq22FrnNldAkbGqLoZmgydUnUzNBk6pepmaDK0lXoKLAIngL3AAeAkcN11pmZo6tU7t9ZRlsvAJgEjhuulO3OrZpaAEaP1MTTcsBGjdR5jEaNThrmIwbo2YCx7gBW3oPQDuAdMEUnEYJ0aMJaVPl/7KBZsMViH+4xjouB1VhTYYqz+AfsHjOVnwXbBscVQbQJnC8Zyv2T7oNhipD4B8yVjmXKYUWKLgfoMHK04nkngYcn+nrjfr2w0KSFHjZ0acrTYlpFbwF0r2JaRxZUJbOvIYgVbjN3CtQq2730u2lu/VJDFE3YbpaSELB6wt9y6ifekhiw1sTvALhQSeu1iXgG5DvYqSgm5CndOEbkqdttNFx2HPINSmoJdB24Ap92b630NIFfBxs3JKvPyzmgDfwAuDHlMPpGrYqtH+yXqoQiQo8DWPJNnRzieZcVjuk3AaA1qocYx5amD6g2HddPkxdAs9KKnvgvt2zvz0Mc89l1oPbAkAT3jue/C9yN40tB1+y58LSolBX1cqe+i7jLp7tT6Oq4qLr63aiA/SK2v41nB99PCroJcdf9moKWkUdw39jDIwbC1oN8DBxvAHgU5CLYo1nP3kBLqhWnwF7JNQQvwomQxXbsVIIpWgyagJWM3+6fn1wJPI9Ohp5Em/5nCmgfsOn0XQbFvNQgtHrDr9l0Ew+7t8I0h7I6Hvotg2HOGsFc9jTnomX0TeB3ZBbKt2HcR/AIZWyYU+y4ydoOpgl3Uf53j8aHm+zA7yxkd+0vJtjkjTCOP+0DfGXZHOZSmd+HrzcnfgK/u48n/yYg+0YQG2w8AAAAASUVORK5CYII=" />
          </defs>
        </svg>

      ),
    },
    {
      id: 'compliance',
      text: 'Compliant and backed by legal opinion',
      icon: (
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" href="http://www.w3.org/1999/xlink">
          <rect width="45" height="45" fill="url(#pattern0_18_141)" />
          <defs>
            <pattern id="pattern0_18_141" patternContentUnits="objectBoundingBox" width="1" height="1">
              <use href="#image0_18_141" transform="scale(0.0111111)" />
            </pattern>
            <image id="image0_18_141" width="90" height="90" preserveAspectRatio="none" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACLklEQVR4nO2dsWoUURSGPwwkmCfIrpaKj5FKnyYKpnDSWFmkshHBgMEyD5IisVOw2SewVDSKxBRHLoxgkYXJOvees2f+D74uS879GGYuM5sJCCGEEEIIIcSEeAS8BRbAD8DW0DL3e+AJsEUwHgCnASLZyH4E7hKEXeBrgChWMfZWhCM5c2TrfewdOuPpwq7x3DPywwABrJHfPUMfBwhgDXVjEWDxNoXQFwEWb1MI7b1wU+icuuG9cFPonLrhvXBT6Jy6YQG8BJ4B84Ezl5/r+s8pNMMt0VahfE6hGe5sxdl3FJpmi1doFPq/BjWFbjPo5Q13CLVJG7ojFmlDz4hF2tBzYpE2dEcsUl8Mu0BHdtrQVsGW87vhHdkaz++Gd2RrPL8bFsD5irPfUWia7GQOFJqqOxnd+Ce+Co1Cp1KhUehUKjQKXcWxntTcdKs3udDdyOsY+h2PyYWejbyOod/xmFzo+cjrGHrfw40sp44DhabqkxpdDImpQqPQqVRoFDqVCo1Cp1KhUehUKjT1/abQ5H/Vj03IPYWmuh+ATYWmeuRyv9oVS+oFcNafLlyP5L8sG/QX8LR/RCQqhi6RRYPQOpJH5rNCt+FwSej9Rr9/Mmz37+y87mK4H/AvZdeadwG2Y1bR8srm18Bt79D3gd8BglhljwjA8wAhrLI/gVveocsAJwFiWPbQhQ3gBXAVIIpV8A3BuAe8BD6t8b8HsX/8AryKcDEUQgghhBBCCGrwBw6HY5VgE5P2AAAAAElFTkSuQmCC" />
          </defs>
        </svg>

      ),
    },
  ];

  return (
    <div className="w-full bg-[#DDEAE4]">
      <section id="security" className="relative z-10 w-full bg-white rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[72px] pt-20 sm:pt-28 pb-24 sm:pb-32 px-6 sm:px-10 lg:px-16 shadow-xl">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-14 sm:mb-16">
            <span className="text-xs sm:text-[13px] font-bold tracking-[0.25em] uppercase text-[#4B5563] block mb-6 sm:mb-8">
              YOUR ASSET, PROTECTED
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-black tracking-tight leading-[1.18] max-w-2xl mx-auto">
              Build on Security & <br className="hidden sm:inline" />
              Transparency
            </h2>

            <p className="text-[#4B5563] text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-6 sm:mt-8 leading-relaxed font-normal">
              Your property is placed in a dedicated legal structure with independent oversight, so you can move forward with confidence
            </p>
          </div>

          <div className="relative w-full max-w-2xl mx-auto bg-[#00694B1C] rounded-[28px] sm:rounded-[40px] border border-[#00694B]/20 shadow-[4px_12px_28px_-6px_#00694B] overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2">

              <div className="px-6 py-8 sm:px-8 sm:py-10 flex items-center gap-5 sm:border-r border-b border-[#00694B]/20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-[#00694B]/20">
                  {securityFeatures[0].icon}
                </div>
                <span className="text-black font-semibold text-sm sm:text-[15px] leading-snug">
                  {securityFeatures[0].text}
                </span>
              </div>

              <div className="px-6 py-8 sm:px-8 sm:py-10 flex items-center gap-5 border-b border-[#00694B]/20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-[#00694B]/20">
                  {securityFeatures[1].icon}
                </div>
                <span className="text-black font-semibold text-sm sm:text-[15px] leading-snug">
                  {securityFeatures[1].text}
                </span>
              </div>

              <div className="px-6 py-8 sm:px-8 sm:py-10 flex items-center gap-5 sm:border-r border-b sm:border-b-0 border-[#00694B]/20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-[#00694B]/20">
                  {securityFeatures[2].icon}
                </div>
                <span className="text-black font-semibold text-sm sm:text-[15px] leading-snug">
                  {securityFeatures[2].text}
                </span>
              </div>

              <div className="px-6 py-8 sm:px-8 sm:py-10 flex items-center gap-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-[#00694B]/20">
                  {securityFeatures[3].icon}
                </div>
                <span className="text-black font-semibold text-sm sm:text-[15px] leading-snug">
                  {securityFeatures[3].text}
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
