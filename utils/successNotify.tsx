import toast from "react-hot-toast";

export default function successNotify({ message }: { message: string }) {
  toast.success(message, {
    duration: 3000,
    position: "top-center",
    style: {
      background: "#fff",
      color: "#333",
    },
  });
}