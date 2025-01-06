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

  const handleDownload = () => {
    if (!isClient) return; // Prevent executing on the server side

    setShowLoadingScreen(true);
    setIsGenerating(true);

    setTimeout(() => {
      const contentDiv = document.getElementById("main");

      contentDiv.style.visibility = "visible";
      contentDiv.style.position = "relative";

      const element = contentRef.current;

      try {
        const options = {
          filename: "coupons_report.pdf",
          image: { type: "jpeg", quality: 0.5 },
          html2canvas: { scale: 2, logging: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        html2pdf().from(element).set(options).save();
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        contentDiv.style.display = "none";
        contentDiv.style.position = "absolute";

        setIsGenerating(false);
        setShowLoadingScreen(false);
      }
    }, 1000);
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
        <div ref={contentRef}>
          {couponList.length > 0 ? (
            couponList.map((coupon, index) => (
              <div
                key={coupon.CouponId}
                className={`${style.bgColor} text-white`}
                style={{ pageBreakAfter: "always" }}
              >
                <div className="flex flex-wrap">
                  <div
                    key={coupon.CouponId}
                    className="w-full"
                    style={{
                      marginBottom: "32px",
                      pageBreakInside: "avoid",
                    }}
                  >
                    <div className="bg-white">
                      <img
                        src="/images/trubsond-logo-png.png"
                        alt="Logo"
                        width={150}
                        height={150}
                      />
                    </div>
                    <div className="flex justify-between px-6">
                      <div className="text-sm mr-4 mt-4 mb-2">
                        <h1 className="underline">Process:</h1>
                        <p className="text-justify">
                          To redeem your coupon, contact your nearest Trubond retailer to receive the coupon payment immediately.
                        </p>
                      </div>
                      <div className="py-5">
                        <h1 className="text-nowrap text-xl">
                          Coupon Code: {coupon.CouponCode}
                        </h1>
                      </div>
                    </div>
                    <div className="flex justify-between px-6 text-sm">
                      <div className="w-2/3">
                        <h2 className={`${style.underLineText}`}>
                          Terms and Conditions:
                        </h2>
                        <ol>
                          <li className="flex">
                            <span className={`${style.dot}`}>&#x2022;</span>
                            <p>This offer is valid only on select products.</p>
                          </li>
                          <li className="flex">
                            <span className={`${style.dot}`}>&#x2022;</span>
                            <p>This coupon can only be redeemed at authorized distributors.</p>
                          </li>
                          <li className="flex">
                            <span className={`${style.dot}`}>&#x2022;</span>
                            <p>The QR code can only be scanned once.</p>
                          </li>
                          <li className="flex">
                            <span className={`${style.dot}`}>&#x2022;</span>
                            <p>This coupon cannot be exchanged for cash.</p>
                          </li>
                          <li className="flex">
                            <span className={`${style.dot}`}>&#x2022;</span>
                            <p>Torn or damaged coupons will not be accepted.</p>
                          </li>
                          <li className="flex">
                            <span className={`${style.dot}`}>&#x2022;</span>
                            <p>All general terms and conditions of the company apply.</p>
                          </li>
                          <li className="flex">
                            <span className={`${style.dot}`}>&#x2022;</span>
                            <p>The company reserves the right to modify or cancel this offer without prior notice.</p>
                          </li>
                          <li className="flex">
                            <span className={`${style.dot}`}>&#x2022;</span>
                            <p>The company’s decision regarding the coupon redemption process will be final and binding.</p>
                          </li>
                        </ol>
                      </div>
                      <div className="px-5">
                        {qrCodeUrls[coupon.CouponCode] && (
                          <img
                            src={qrCodeUrls[coupon.CouponCode]}
                            alt={`QR Code for ${coupon.CouponCode}`}
                            className="mt-4 w-48 h-48"
                          />
                        )}
                      </div>
                    </div>
                    <small className={`${style.smallText} px-6 pb-2`}>
                      *For any assistance, please contact our helpline - [ +91 79765 74376]*
                    </small>
                  </div>
                </div>
              </div>
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
