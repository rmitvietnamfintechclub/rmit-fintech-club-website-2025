import { PartnerItem } from "@/app/(frontend)/(router)/(home_page)/components/partners";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import styles from "@/styles/partners.module.css";

interface PartnerLogo {
  id: number;
  url: string;
  alt: string;
}
interface PartnersDivProps {
  allItems: PartnerItem[];
  activeItemId: number;
  animating: boolean; // State fade-in/out
}

const DecorativeSVG = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 158 170"
    fill="none"
    className={className}
  >
    <path
      d="M109.947 114.433L153.358 93.6823L154.111 93.2659C155.229 92.5574 156.138 91.5529 156.745 90.3549C157.353 89.1569 157.637 87.8083 157.57 86.4469C157.502 85.0854 157.085 83.76 156.36 82.6058C155.636 81.4516 154.63 80.5101 153.446 79.8773L110.323 56.761L103.743 7.4808L103.587 6.6406C103.262 5.31202 102.602 4.0894 101.673 3.0979C100.744 2.1064 99.5806 1.38168 98.3014 0.99792C97.0222 0.614161 95.6734 0.585176 94.393 0.913908C93.1126 1.24264 91.9467 1.91729 91.0146 2.86879L57.0972 37.4625L9.72125 27.7465L8.90419 27.6253C7.5802 27.5057 6.25586 27.7501 5.06705 28.3333C3.87823 28.9166 2.86772 29.8178 2.13921 30.9444C1.41069 32.0711 0.990361 33.3826 0.921367 34.7445C0.852378 36.1063 1.13721 37.4695 1.74663 38.6942L23.8802 83.2145L1.06692 126.517L0.702629 127.315C0.217939 128.571 0.0680532 129.943 0.268231 131.291C0.468409 132.64 1.0115 133.916 1.84217 134.991C2.67284 136.066 3.7614 136.9 4.99694 137.409C6.2325 137.918 7.57089 138.084 8.87575 137.889L56.4669 130.799L89.8606 167.233C90.8273 168.288 92.057 169.05 93.4102 169.432C94.7635 169.814 96.1864 169.8 97.5178 169.393C98.8493 168.985 100.036 168.2 100.944 167.127C101.852 166.053 102.444 164.733 102.655 163.317L109.947 114.433Z"
      fill="#F7D27F"
    />
  </svg>
);

const blockchainPartners: PartnerLogo[] = [
  {
    id: 1,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Monad.png",
    alt: "Monad",
  },
  {
    id: 2,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Inferium.png",
    alt: "Inferium",
  },
  {
    id: 3,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Coin98.png",
    alt: "Coin98",
  },
  {
    id: 4,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/OKX.png",
    alt: "OKX",
  },
  {
    id: 5,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/NamiFoundation.png",
    alt: "Nami Foundation",
  },
  {
    id: 6,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/KyrosVentures.png",
    alt: "Kyros Ventures",
  },
  {
    id: 7,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Kardiachain.png",
    alt: "KardiaChain",
  },
  {
    id: 8,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Binance.png",
    alt: "Binance",
  },
  {
    id: 9,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/GFI.png",
    alt: "GFI",
  },
  {
    id: 10,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Polkadot.png",
    alt: "Polkadot",
  },
  {
    id: 11,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Blockaid.svg",
    alt: "Blockaid",
  },
  {
    id: 12,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/TrustWallet.png",
    alt: "Trust Wallet",
  },
  {
    id: 13,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Chainlink.png",
    alt: "Chainlink",
  },
  {
    id: 14,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/U2UNetwork.png",
    alt: "U2U Network",
  },
  {
    id: 15,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Cardano.png",
    alt: "Cardano",
  },
  {
    id: 16,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/NinetyEight.png",
    alt: "Ninety Eight",
  },
  {
    id: 17,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Uniswap.png",
    alt: "Uniswap",
  },
  {
    id: 18,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/ETHVietnam.png",
    alt: "ETH Vietnam",
  },
  {
    id: 19,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/Ethereum.png",
    alt: "Ethereum",
  },
  {
    id: 20,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/blockchain/ESOLLABS.png",
    alt: "ESO Labs",
  },
];

const fintechPartners: PartnerLogo[] = [
  {
    id: 1,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/SSI.png",
    alt: "SSI",
  },
  {
    id: 2,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/KPMG-New.png",
    alt: "KPMG",
  },
  {
    id: 3,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/PWC.png",
    alt: "PWC",
  },
  {
    id: 4,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/DragonCapital-New.png",
    alt: "Dragon Capital",
  },
  {
    id: 5,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/Infina.png",
    alt: "Infina",
  },
  {
    id: 6,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/Aquila.png",
    alt: "Aquila",
  },
  {
    id: 7,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/Homebase-New.png",
    alt: "Homebase",
  },
  {
    id: 8,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/Tititada-New.png",
    alt: "Tititada",
  },
  {
    id: 9,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/Timo.png",
    alt: "Timo",
  },
  {
    id: 10,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/MooreAISC.png",
    alt: "Moore AISC",
  },
  {
    id: 11,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/Payoo.png",
    alt: "Payoo",
  },
  {
    id: 12,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/FPTSecurities-New.png",
    alt: "FPT Security",
  },
  {
    id: 13,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/fintech/Momo.png",
    alt: "MoMo",
  },
];

const academicPartners: PartnerLogo[] = [
  {
    id: 1,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/academic/RMITTheBusinessSchool.png",
    alt: "RMIT The Business School",
  },
  {
    id: 2,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/academic/RMITFintechCryptoHub.png",
    alt: "RMIT Fintech Crypto Hub",
  },
];

const hospitalityPartners: PartnerLogo[] = [
  {
    id: 1,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/hospitality/Sofitel.png",
    alt: "Sofitel Hotel & Resort",
  },
  {
    id: 2,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/hospitality/FusionOriginal.png",
    alt: "Fusion Original",
  },
];

const charityPartners: PartnerLogo[] = [
  {
    id: 1,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/charity/Assist-New.png",
    alt: "Assist",
  },
  {
    id: 2,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/charity/NhipTimVietNam.png",
    alt: "Nhip Tim Viet Nam",
  },
  {
    id: 3,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/charity/Lotus.png",
    alt: "Quy Tu Thien Bong Sen",
  },
];

const otherPartners: PartnerLogo[] = [
  {
    id: 1,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/others/FipharmcoSkinLab.png",
    alt: "Fipharmco SkinLab",
  },
  {
    id: 2,
    url: "https://d2prwyp3rwi40.cloudfront.net/home/partners/others/Arches.png",
    alt: "Arches",
  },
];

const partnerConfig: Record<
  number,
  {
    title: string;
    partners: PartnerLogo[];
    gridCols: string;
    imageHeight: string;
    centerLast?: boolean;
  }
> = {
  4: {
    title: "Blockchain & Cryptocurrency",
    partners: blockchainPartners,
    gridCols: "grid-cols-5",
    imageHeight: "h-[4.75rem]",
  },
  5: {
    title: "Fintech & Innovation",
    partners: fintechPartners,
    gridCols: "grid-cols-4",
    imageHeight: "h-[4.75rem]",
    centerLast: true,
  },
  3: {
    title: "Academic",
    partners: academicPartners,
    gridCols: "flex-row",
    imageHeight: "h-[15rem]",
  },
  2: {
    title: "Hospitality",
    partners: hospitalityPartners,
    gridCols: "flex-row",
    imageHeight: "h-[12rem]",
  },
  6: {
    title: "Charity Organizations",
    partners: charityPartners,
    gridCols: "flex-row",
    imageHeight: "h-[15rem]",
  },
  1: {
    title: "Other Partners",
    partners: otherPartners,
    gridCols: "flex-row",
    imageHeight: "h-[20rem]",
  },
};

export default function PartnersDiv({
  allItems,
  activeItemId,
  animating,
}: PartnersDivProps) {
  const activeItem =
    allItems.find((item) => item.id === activeItemId) || allItems[3];
  const config = partnerConfig[activeItem.id];

  const { title, partners, gridCols, imageHeight, centerLast } = config;

  const [animationClass, setAnimationClass] = useState(styles.fade_in_content);

  useEffect(() => {
    setAnimationClass(
      animating ? styles.fade_out_content : styles.fade_in_content
    );
  }, [animating, activeItemId]);

  return (
    <div className="content mr-[8.5vw] ml-auto">
      <h1
        className="ml-[1.5rem] mb-[1.5rem] text-[#0D1742] !font-extrabold drop-shadow-[0_4px_4px_rgba(255,204,102,0.6)]"
        aria-label="Our Partners"
      >
        Partners
      </h1>
      <div className="bg-[linear-gradient(90deg,_#C9D6EA_10px,_#FFEFCA)] w-[70vw] h-[88vh] rounded-[2vw] p-[1vw]">
        <div className="w-full h-full rounded-[1vw] bg-white flex justify-center">
          <div
            className={
              (clsx("w-full h-full flex flex-col relative"), animationClass)
            }
          >
            <DecorativeSVG className="absolute z-30 left-[1rem] top-[1rem] rotate-[-5deg] w-[30px] h-[30px]" />
            <DecorativeSVG className="absolute z-30 left-[1rem] bottom-[1rem] rotate-[-5deg] w-[30px] h-[30px]" />
            <DecorativeSVG className="absolute z-30 right-[1rem] top-[1rem] rotate-[-5deg] w-[30px] h-[30px]" />
            <DecorativeSVG className="absolute z-30 right-[1rem] bottom-[1rem] rotate-[-5deg] w-[30px] h-[30px]" />
            <h6 className="text-[#DCB968] bg-[#2C305F] w-fit text-center p-4 mx-auto text-[2rem] font-semibold rounded-b-[1rem]">
              {title}
            </h6>
            <div
              className={`flex-1 flex items-center justify-center px-[4rem] py-[1rem] pb-0 ${
                gridCols.includes("grid")
                  ? `grid ${gridCols} h-[65vh] gap-4 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:${gridCols}`
                  : "flex flex-row h-[62vh] gap-12 flex-wrap"
              }`}
            >
              {partners.map((partner, index) => {
                if (
                  centerLast &&
                  index === partners.length - 1 &&
                  partners.length % 4 === 1
                ) {
                  return (
                    <div
                      key={partner.id}
                      className="col-span-4 flex justify-center"
                    >
                      <Image
                        src={partner.url}
                        alt={partner.alt}
                        className={`${imageHeight} w-auto object-contain`}
                        width={400}
                        height={400}
                        fetchPriority="high"
                        loading="eager"
                        priority={true}
                      />
                    </div>
                  );
                }
                return (
                  <Image
                    key={partner.id}
                    src={partner.url}
                    alt={partner.alt}
                    className={`${imageHeight} w-auto object-contain`}
                    width={400}
                    height={400}
                    fetchPriority="high"
                    loading="eager"
                    priority={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
