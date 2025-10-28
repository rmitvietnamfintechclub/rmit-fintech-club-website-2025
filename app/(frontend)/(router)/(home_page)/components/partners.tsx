"use client";
import { useState, useRef } from "react"; // Không cần useMemo nữa
import PartnersCircle from "@/components/home/PartnersCircle";
import PartnersDiv from "@/components/home/PartnersDiv";
import styles from "@/styles/partners.module.css";

// Type definition for each partner item
export type PartnerItem = {
  id: number;
  icon: string;
  bg: string;
};

// Initial state: 6 partners
const baseItems = [
  { id: 1, icon: "/home/other_partners.svg" },
  { id: 2, icon: "/home/hospitality.svg" },
  { id: 3, icon: "/home/academic.svg" },
  { id: 4, icon: "/home/blockchain.svg" },
  { id: 5, icon: "/home/fintech.svg" },
  { id: 6, icon: "/home/charity.svg" },
] as const;

// Create the initial state by mapping over baseItems
const initialItems: PartnerItem[] = baseItems.map((it, i) => ({
  ...it,
  bg: i % 2 === 0 ? "bg-blueSlate" : "bg-bluePrimary",
}));

// --- CONFIGURATION ---
const ANIMATION_DURATION = 3000; // Tổng thời gian animation vòng tròn (3s)
const CONTENT_UPDATE_DELAY = 1000; // Thời gian update nội dung sớm (1s)
// --- END CONFIGURATION ---

export default function Partners() {
  // STATE 1: Chỉ dành cho vòng tròn. Update SAU 3 giây.
  const [circleItems, setCircleItems] = useState(initialItems);

  // STATE 2: Chỉ dành cho PartnersDiv. Update SỚM sau 1 giây.
  // Ban đầu, item active là item ở vị trí thứ 4 (index 3)
  const [activeItemId, setActiveItemId] = useState(initialItems[3].id);

  // STATE 3: Điều khiển fade-in/out cho PartnersDiv
  const [isContentAnimating, setIsContentAnimating] = useState(false);

  // STATE 4: Khóa click khi vòng tròn đang xoay
  const [isCircleAnimating, setIsCircleAnimating] = useState(false);

  const circleRef = useRef<(HTMLDivElement | null)[]>([]);

  // Helper: return the opposite background color of neighbor
  const getNextBg = (neighborBg: string): string =>
    neighborBg === "bg-blueSlate" ? "bg-bluePrimary" : "bg-blueSlate";

  const handleClick = (dir: "next" | "prev") => {
    // Nếu vòng tròn đang xoay thì không làm gì cả
    if (isCircleAnimating) return;

    // 1. BẮT ĐẦU: Khóa click, chạy animation CSS và bắt đầu fade-out content
    setIsCircleAnimating(true);
    setIsContentAnimating(true); // Ra lệnh cho PartnersDiv mờ đi (fade-out)

    circleRef.current.forEach((el, index) => {
      if (el) {
        el.classList.add(styles[`circle_item_${index + 1}_${dir}`]);
      }
    });

    // 2. UPDATE CONTENT SỚM (Sau 1 giây)
    setTimeout(() => {
      // Tìm ID của item *sắp* đi vào giữa
      // Dựa trên state *hiện tại* của vòng tròn
      const nextActiveItem =
        dir === "next"
          ? circleItems[4] // Item ở vị trí 5 (index 4)
          : circleItems[2]; // Item ở vị trí 3 (index 2)

      setActiveItemId(nextActiveItem.id); // Cập nhật state cho PartnersDiv
      setIsContentAnimating(false); // Ra lệnh cho PartnersDiv hiện ra (fade-in)
    }, CONTENT_UPDATE_DELAY); // 1000ms

    // 3. UPDATE VÒNG TRÒN MUỘN (Sau 3 giây)
    setTimeout(() => {
      // Bây giờ mới thực sự update state của vòng tròn
      setCircleItems((prevItems) => {
        const rotated = [...prevItems];

        if (dir === "prev") {
          const popped = rotated.pop()!;
          const neighborBg = rotated[0].bg;
          popped.bg = getNextBg(neighborBg);
          rotated.unshift(popped);
        } else {
          const shifted = rotated.shift()!;
          const neighborBg = rotated[rotated.length - 1].bg;
          shifted.bg = getNextBg(neighborBg);
          rotated.push(shifted);
        }
        return rotated;
      });

      // 4. DỌN DẸP
      setIsCircleAnimating(false); // Mở khóa click

      // Xóa class CSS animation
      circleRef.current.forEach((el, index) => {
        el?.classList.remove(styles[`circle_item_${index + 1}_${dir}`]);
      });
    }, ANIMATION_DURATION); // 3000ms
  };

  return (
    <div className="w-[100vw] h-fit min-h-[35vh] bg-[#F9FAFB] py-20 relative flex items-center">
      <PartnersCircle
        items={circleItems}
        handleClick={handleClick}
        circleRef={circleRef}
        animating={isCircleAnimating}
      />
      <div className="absolute z-30 left-[37rem] top-[3.3rem] rotate-[-5deg]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="70"
          height="70"
          viewBox="0 0 158 170"
          fill="none"
        >
          <path
            d="M109.947 114.433L153.358 93.6823L154.111 93.2659C155.229 92.5574 156.138 91.5529 156.745 90.3549C157.353 89.1569 157.637 87.8083 157.57 86.4469C157.502 85.0854 157.085 83.76 156.36 82.6058C155.636 81.4516 154.63 80.5101 153.446 79.8773L110.323 56.761L103.743 7.4808L103.587 6.6406C103.262 5.31202 102.602 4.0894 101.673 3.0979C100.744 2.1064 99.5806 1.38168 98.3014 0.99792C97.0222 0.614161 95.6734 0.585176 94.393 0.913908C93.1126 1.24264 91.9467 1.91729 91.0146 2.86879L57.0972 37.4625L9.72125 27.7465L8.90419 27.6253C7.5802 27.5057 6.25586 27.7501 5.06705 28.3333C3.87823 28.9166 2.86772 29.8178 2.13921 30.9444C1.41069 32.0711 0.990361 33.3826 0.921367 34.7445C0.852378 36.1063 1.13721 37.4695 1.74663 38.6942L23.8802 83.2145L1.06692 126.517L0.702629 127.315C0.217939 128.571 0.0680532 129.943 0.268231 131.291C0.468409 132.64 1.0115 133.916 1.84217 134.991C2.67284 136.066 3.7614 136.9 4.99694 137.409C6.2325 137.918 7.57089 138.084 8.87575 137.889L56.4669 130.799L89.8606 167.233C90.8273 168.288 92.057 169.05 93.4102 169.432C94.7635 169.814 96.1864 169.8 97.5178 169.393C98.8493 168.985 100.036 168.2 100.944 167.127C101.852 166.053 102.444 164.733 102.655 163.317L109.947 114.433Z"
            fill="#F7D27F"
          />
        </svg>
      </div>
      <div className="absolute z-30 left-[42rem] top-[7rem] rotate-[-5deg]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 158 170"
          fill="none"
        >
          <path
            d="M109.947 114.433L153.358 93.6823L154.111 93.2659C155.229 92.5574 156.138 91.5529 156.745 90.3549C157.353 89.1569 157.637 87.8083 157.57 86.4469C157.502 85.0854 157.085 83.76 156.36 82.6058C155.636 81.4516 154.63 80.5101 153.446 79.8773L110.323 56.761L103.743 7.4808L103.587 6.6406C103.262 5.31202 102.602 4.0894 101.673 3.0979C100.744 2.1064 99.5806 1.38168 98.3014 0.99792C97.0222 0.614161 95.6734 0.585176 94.393 0.913908C93.1126 1.24264 91.9467 1.91729 91.0146 2.86879L57.0972 37.4625L9.72125 27.7465L8.90419 27.6253C7.5802 27.5057 6.25586 27.7501 5.06705 28.3333C3.87823 28.9166 2.86772 29.8178 2.13921 30.9444C1.41069 32.0711 0.990361 33.3826 0.921367 34.7445C0.852378 36.1063 1.13721 37.4695 1.74663 38.6942L23.8802 83.2145L1.06692 126.517L0.702629 127.315C0.217939 128.571 0.0680532 129.943 0.268231 131.291C0.468409 132.64 1.0115 133.916 1.84217 134.991C2.67284 136.066 3.7614 136.9 4.99694 137.409C6.2325 137.918 7.57089 138.084 8.87575 137.889L56.4669 130.799L89.8606 167.233C90.8273 168.288 92.057 169.05 93.4102 169.432C94.7635 169.814 96.1864 169.8 97.5178 169.393C98.8493 168.985 100.036 168.2 100.944 167.127C101.852 166.053 102.444 164.733 102.655 163.317L109.947 114.433Z"
            fill="#F7D27F"
          />
        </svg>
      </div>
      <PartnersDiv
        allItems={initialItems}
        activeItemId={activeItemId}
        animating={isContentAnimating}
      />
    </div>
  );
}
