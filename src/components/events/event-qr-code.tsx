import QRCode from "qrcode";
import Image from "next/image";

type EventQrCodeProps = {
  title: string;
  url: string;
};

export async function EventQrCode({ title, url }: EventQrCodeProps) {
  const dataUrl = await QRCode.toDataURL(url, {
    color: {
      dark: "#0f766e",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
    margin: 1,
    width: 240,
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
      <Image
        alt={`QR code for ${title}`}
        className="mx-auto size-56"
        height={224}
        src={dataUrl}
        unoptimized
        width={224}
      />
      <p className="mt-3 break-all text-xs leading-5 text-slate-500">{url}</p>
    </div>
  );
}
