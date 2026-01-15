import toast from "react-hot-toast";

export default function failedNotify({ message }: { message: string }) {
  toast.error(message, {
    duration: 3000,
    position: "top-center",
    style: {
      background: "#fff",
      color: "#333",
    },
  });
}