'use client';

import Image from 'next/image';

type Icon = {
  id: number;
  image: string;
  twitter: string;
  x: string;
  y: string;
  blur: number;
  size: number;
  mobileSize: number;
  delay: number;
  floatAnim: string;
};

const icons: Icon[] = [
  {
    id: 1,
    image: 'https://pbs.twimg.com/profile_images/1876581196173320192/pF4KQQCb_400x400.jpg',
    twitter: 'extendedapp',
    x: '15%',
    y: '20%',
    blur: 6,
    size: 82,
    mobileSize: 60,
    delay: 0,
    floatAnim: 'animate-float1',
  },
  {
    id: 2,
    image: 'https://pbs.twimg.com/profile_images/1024585501901303808/m92jEcPI_400x400.jpg',
    twitter: 'ready_co',
    x: '75%',
    y: '15%',
    blur: 7,
    size: 95,
    mobileSize: 70,
    delay: 0.2,
    floatAnim: 'animate-float2',
  },
  {
    id: 3,
    image: 'https://pbs.twimg.com/profile_images/1736767433635975168/G1H8l7Ci_400x400.jpg',
    twitter: 'avnu_fi',
    x: '85%',
    y: '45%',
    blur: 8,
    size: 78,
    mobileSize: 56,
    delay: 0.4,
    floatAnim: 'animate-float3',
  },
  {
    id: 4,
    image: 'https://pbs.twimg.com/profile_images/1846554119777013760/FydsgAUR_400x400.jpg',
    twitter: 'myBraavos',
    x: '20%',
    y: '70%',
    blur: 6,
    size: 100,
    mobileSize: 72,
    delay: 0.1,
    floatAnim: 'animate-float4',
  },
  {
    id: 5,
    image: 'https://pbs.twimg.com/profile_images/1872475547059834880/TGT0jlCk_400x400.jpg',
    twitter: 'XverseApp',
    x: '80%',
    y: '75%',
    blur: 9,
    size: 75,
    mobileSize: 54,
    delay: 0.3,
    floatAnim: 'animate-float5',
  },
  {
    id: 6,
    image: 'https://pbs.twimg.com/profile_images/1982565692663599104/X5i_XGxL_400x400.jpg',
    twitter: 'vesuxyz',
    x: '10%',
    y: '45%',
    blur: 7,
    size: 88,
    mobileSize: 64,
    delay: 0.5,
    floatAnim: 'animate-float6',
  },
  {
    id: 7,
    image: 'https://pbs.twimg.com/profile_images/1676963409303322624/NuCcNNxa_400x400.png',
    twitter: 'EkuboProtocol',
    x: '65%',
    y: '85%',
    blur: 8,
    size: 92,
    mobileSize: 66,
    delay: 0.2,
    floatAnim: 'animate-float1',
  },
  {
    id: 8,
    image: 'https://pbs.twimg.com/profile_images/1782677936585256960/JAwtVCsD_400x400.png',
    twitter: 'cairolang',
    x: '30%',
    y: '12%',
    blur: 6,
    size: 80,
    mobileSize: 58,
    delay: 0.4,
    floatAnim: 'animate-float2',
  },
  {
    id: 9,
    image: 'https://pbs.twimg.com/profile_images/1845153042762436629/LZs7_I2b_400x400.jpg',
    twitter: 'cartridge_gg',
    x: '92%',
    y: '60%',
    blur: 7,
    size: 98,
    mobileSize: 70,
    delay: 0.1,
    floatAnim: 'animate-float3',
  },
  {
    id: 10,
    image: 'https://pbs.twimg.com/profile_images/1845152900256829447/H6PRbeYs_400x400.jpg',
    twitter: 'ohayo_dojo',
    x: '5%',
    y: '85%',
    blur: 9,
    size: 76,
    mobileSize: 55,
    delay: 0.3,
    floatAnim: 'animate-float4',
  },
  {
    id: 11,
    image: 'https://pbs.twimg.com/profile_images/1854492998954012672/wcFszeR-_400x400.jpg',
    twitter: 'endurfi',
    x: '50%',
    y: '30%',
    blur: 6,
    size: 85,
    mobileSize: 62,
    delay: 0.15,
    floatAnim: 'animate-float5',
  },
  {
    id: 12,
    image: 'https://pbs.twimg.com/profile_images/1635993072327639041/G_YIQ-G1_400x400.jpg',
    twitter: 'layerswap',
    x: '60%',
    y: '25%',
    blur: 7,
    size: 90,
    mobileSize: 65,
    delay: 0.35,
    floatAnim: 'animate-float6',
  },
  {
    id: 13,
    image: 'https://pbs.twimg.com/profile_images/1940437227642798080/EnotVJl3_400x400.jpg',
    twitter: 'tradeparadex',
    x: '25%',
    y: '40%',
    blur: 8,
    size: 83,
    mobileSize: 60,
    delay: 0.45,
    floatAnim: 'animate-float1',
  },
  {
    id: 14,
    image: 'https://pbs.twimg.com/profile_images/1686699616853454848/GMEuUL8M_400x400.jpg',
    twitter: 'FocusTree_',
    x: '40%',
    y: '55%',
    blur: 10,
    size: 78,
    mobileSize: 56,
    delay: 0.25,
    floatAnim: 'animate-float2',
  },
];

type FloatingIconsProps = {
  isAnimating?: boolean;
};

const FloatingIcons = ({ isAnimating }: FloatingIconsProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {icons.map((icon) => {
        return (
          <div
            key={icon.id}
            className={`absolute transition-all duration-200 ${
              isAnimating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
            style={{
              left: icon.x,
              top: icon.y,
              animationDelay: `${icon.delay}s`,
            }}
          >
            <a
              href={`https://twitter.com/${icon.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-300 ${icon.floatAnim} overflow-hidden hover:scale-110 hover:shadow-2xl cursor-pointer block`}
              style={{
                width: `${icon.size}px`,
                height: `${icon.size}px`,
                animationDelay: `${icon.delay}s`,
                filter: `blur(${icon.blur}px)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'blur(0px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = `blur(${icon.blur}px)`;
              }}
            >
              <Image
                src={icon.image}
                alt="App logo"
                width={icon.size}
                height={icon.size}
                className="object-cover rounded-full"
              />
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default FloatingIcons;

