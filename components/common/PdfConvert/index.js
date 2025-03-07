import React, { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import QRCode from "qrcode";
import style from "./pdf.module.css";

const GeneratePDF = ({ data }) => {
  const contentRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHtmlLoaded, setIsHtmlLoaded] = useState(false);
  const [qrCodeUrls, setQrCodeUrls] = useState({});
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isClient, setIsClient] = useState(false); // Add state for checking client-side rendering

  useEffect(() => {
    // This ensures that the code inside this effect runs only on the client-side
    setIsClient(typeof window !== "undefined");
  }, []);

  const handleDownload = async () => {
    if (!isClient) return;

    setShowLoadingScreen(true);
    setIsGenerating(true);

    try {
      const contentDiv = document.getElementById("main");
      contentDiv.style.display = "block";
      contentDiv.style.position = "relative";

      const element = contentRef.current;
      const options = {
        filename: "coupons_report.pdf",
        image: { type: "jpeg", quality: 0.8 },
        html2canvas: { scale: 2, logging: false, useCORS: true },
        jsPDF: { unit: "mm", format: "a3", orientation: "portrait" },
      };

      await html2pdf().from(element).set(options).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      document.getElementById("main").style.display = "none";
      setIsGenerating(false);
      setShowLoadingScreen(false);
    }
  };

  const generateQrCode = async (couponCode) => {
    try {
      const qrCodeUrl = await QRCode.toDataURL(couponCode);
      setQrCodeUrls((prev) => ({
        ...prev,
        [couponCode]: qrCodeUrl,
      }));
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  useEffect(() => {
    if (data && data.coupons) {
      data.coupons.forEach((coupon) => {
        generateQrCode(coupon.CouponCode);
      });
    }
  }, [data]);

  useEffect(() => {
    if (data && data.coupons) {
      const allQrCodesGenerated = data.coupons.every(
        (coupon) => qrCodeUrls[coupon.CouponCode]
      );
      setIsHtmlLoaded(allQrCodesGenerated);
    }
  }, [qrCodeUrls, data]);

  const couponList = data.coupons || [];

  return (
    <>
      {showLoadingScreen && (
        <div className={`${style.loadingOverlay}`}>
          <div className={`${style.loadingSpinner}`}>Generating PDF...</div>
        </div>
      )}

      <div
        id="main"
        style={{
          display: "none",
          position: "absolute",
        }}
      >
        <div ref={contentRef} className="grid grid-cols-5 gap-1 p-1">
          {couponList.length > 0 ? (
            couponList.map((coupon, index) => (
              <>
                <div
                  key={coupon.CouponId}
                  className="p-1 text-white h-48 flex flex-col"
                  style={{ pageBreakInside: "avoid" }} // Prevents splitting coupons across pages
                >
                  {/* Logo */}
                  <img
                    src="/images/trubsond-logo-png.png"
                    alt="Logo"
                    className="w-10 h-10 mt-1"
                  />
                  <div className="bg-[#215064] flex p-1 h-40">
                    <div>
                      {/* Coupon Info */}
                      <p className="text-[7px]">
                        <strong className="text-xs">Procedure:</strong>
                        <br />
                        To redeem your coupon, contact your nearest Truebond
                        retailer.
                      </p>

                      {/* Terms */}
                      <p className="text-xs">
                        <strong>Terms and Conditions:</strong>
                        <ol className="text-[7px] list-decimal ml-4" type="1">
                          <li>Valid for selected products.</li>
                          <li className="-mt-2">
                            Redeem at authorized stores.
                          </li>
                          <li className="-mt-2">
                            Cannot be exchanged for cash.
                          </li>
                          <li className="-mt-2">Valid until expiry date.</li>
                          <li className="-mt-2">
                            Damaged coupons not accepted.
                          </li>
                        </ol>
                      </p>
                    </div>
                    <div>
                      {/* QR Code */}
                      {qrCodeUrls[coupon.CouponCode] && (
                        <img
                          src={qrCodeUrls[coupon.CouponCode]}
                          alt="QR Code"
                          className="w-24 h-24 mt-2 float-right"
                        />
                      )}
                      <p className="text-[7px] w-16">
                        <strong>Code:</strong>
                        <span className="text-[7px] break-all">
                          {coupon.CouponCode}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ))
          ) : (
            <p>No coupons available</p>
          )}
        </div>
      </div>

      <button
        className="py-2.5 px-5 me-2 mt-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        type="button"
        onClick={handleDownload}
        disabled={isGenerating || !isHtmlLoaded}
      >
        {isGenerating ? "Generating Pdf ..." : "Generate PDF"}
      </button>
    </>
  );
};

export default GeneratePDF;
