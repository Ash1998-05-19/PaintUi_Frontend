import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Import html2canvas for rendering HTML to canvas
import style from "./pdf.module.css";

const GeneratePDF = ({ data }) => {
  const contentRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [qrCodes, setQrCodes] = useState([]); // Store generated QR codes

  // Generate QR codes for each coupon
  useEffect(() => {
    const generateQrCodes = async () => {
      const generatedQrCodes = await Promise.all(
        data.coupons.map(async (coupon) => {
          try {
            const qrCode = await QRCode.toDataURL(coupon.CouponCode);
            return qrCode;
          } catch (error) {
            console.error(
              "Error generating QR Code for coupon:",
              coupon.CouponCode,
              error
            );
            return ""; // Return empty string if error occurs
          }
        })
      );
      setQrCodes(generatedQrCodes);
    };

    if (data && data.coupons) {
      generateQrCodes();
    }
  }, [data]);

  // Check if all QR codes are loaded
  useEffect(() => {
    if (qrCodes.length === data?.coupons?.length && qrCodes.every((qr) => qr)) {
      setIsImageLoaded(true); // Enable the button when all QR codes are loaded
    }
  }, [qrCodes, data.coupons]);

  // Handle PDF generation for two coupons per page
  const handleDownload = async () => {
    setIsGenerating(true); // Set generating state to true

    // Temporarily make content visible and on-screen
    const contentDiv = document.getElementById("main");
    contentDiv.style.visibility = "visible"; // Temporarily make it visible for PDF capture
    contentDiv.style.position = "relative"; // Ensure it is in normal position for rendering

    const pdf = new jsPDF("p", "pt", "a4");

    try {
      // Loop through each coupon, but two coupons per page
      for (let i = 0; i < data.coupons.length; i += 2) {
        const coupon1 = data.coupons[i];
        const coupon2 = data.coupons[i + 1]; // Get the second coupon (if available)

        // Create references for the current coupon elements (i and i+1)
        const couponElement1 = contentRef.current.children[i];
        const couponElement2 = contentRef.current.children[i + 1];

        const canvas1 = await html2canvas(couponElement1, {
          scale: 2, // Increase scale for higher resolution
          useCORS: true, // Ensure external images like QR codes are loaded
        });

        const imgData1 = canvas1.toDataURL("image/png");

        // Add the first coupon to the PDF
        if (i > 0) {
          pdf.addPage();
        }

        const canvas2 = couponElement2
          ? await html2canvas(couponElement2, {
              scale: 2,
              useCORS: true,
            })
          : null;

        const imgData2 = canvas2 ? canvas2.toDataURL("image/png") : null;

        // Add the first coupon (top half of the page)
        pdf.addImage(imgData1, "PNG", 0, 0, 595, 421); // Adjusted for the upper half of the page (421px height)

        if (imgData2) {
          // Add the second coupon (bottom half of the page)
          pdf.addImage(imgData2, "PNG", 0, 421, 595, 421); // Adjusted for the lower half of the page
        }
      }

      // Save the generated PDF
      pdf.save("coupons_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Hide content again after PDF is generated
      contentDiv.style.visibility = "hidden"; // Hide content again
      contentDiv.style.position = "absolute"; // Move content off-screen

      setIsGenerating(false); // Reset generating state
    }
  };

  return (
    <>
      {/* Loading Screen */}
      {isGenerating && (
        <div className={`${style.loadingOverlay}`}>
          <div className={`${style.loadingSpinner}`}>Generating PDF...</div>
        </div>
      )}

      <div
        id="main"
        style={{
          visibility: "hidden",
          position: "absolute",
          left: "-9999px", // Move off-screen
        }}
      >
        <div id="rep1" ref={contentRef}>
          {data.coupons?.length > 0 ? (
            data.coupons.map((coupon, index) => (
              <div
                key={coupon.CouponId}
                className={`${style.bgColor} text-white mb-8 my-14 pb-2`}
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
                  <div className="w-2/3 text-sm mr-4 mt-4 mb-2">
                    <h1 className="underline">प्रक्रिया:</h1>
                    <p className="text-justify">
                      अपना कूपन रिडीम करने के लिए अपने नज़दीकी ट्रूबॉन्ड रिटेलर
                      से संपर्क करें और तुरंत कूपन का भुगतान प्राप्त करें।
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
                      नियम और शर्ते &nbsp;:
                    </h2>
                    <ol>
                      <li className="flex">
                        <span className={`${style.dot}`}>&#x2022;</span>
                        <p>यह योजना केवल चुनिंदा उत्पादों पर ही उपलब्ध है।</p>
                      </li>
                      <li className="flex">
                        <span className={`${style.dot}`}>&#x2022;</span>
                        <p>
                          यह कूपन केवल अधिकृत डिस्ट्रीब्यूटर पर ही रिडीम किया जा
                          सकेगा।
                        </p>
                      </li>
                      <li className="flex">
                        <span className={`${style.dot}`}>&#x2022;</span>
                        <p>
                          एक QR कोड केवल एक ही बार स्कैन करने के लिए मान्य होगा।
                        </p>
                      </li>
                      <li className="flex">
                        <span className={`${style.dot}`}>&#x2022;</span>
                        <p>इस कूपन को नकद राशि नहीं माना जा सकता।</p>
                      </li>
                      <li className="flex">
                        <span className={`${style.dot}`}>&#x2022;</span>
                        <p>कटे-फटे कूपन मान्य नहीं होंगे।</p>
                      </li>
                      <li className="flex">
                        <span className={`${style.dot}`}>&#x2022;</span>
                        <p>अन्य सभी सामान्य नियम और शर्तें लागू होंगी।</p>
                      </li>
                      <li className="flex">
                        <span className={`${style.dot}`}>&#x2022;</span>
                        <p>
                          इस कूपन को रिडीम करने की शर्तें कंपनी के पास सुरक्षित
                          हैं, और कंपनी इस योजना में परिवर्तन करने का अधिकार
                          रखती है।
                        </p>
                      </li>
                      <li className="flex">
                        <span className={`${style.dot}`}>&#x2022;</span>
                        <p>कंपनी का निर्णय ही सर्वमान्य होगा।</p>
                      </li>
                    </ol>
                  </div>
                  <div className="px-5">
                    {qrCodes[index] && (
                      <img
                        src={qrCodes[index]}
                        alt={`QR Code for ${coupon.CouponCode}`}
                        className="mt-4"
                      />
                    )}
                  </div>
                </div>
                <small className={`${style.smallText} px-6 pb-2`}>
                  *किसी भी सहायता के लिए हमारी हेल्पलाइन पर संपर्क करें - [ +91
                  79765 74376]*
                </small>
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
        disabled={!isImageLoaded}
      >
        Generate QR
      </button>
    </>
  );
};

export default GeneratePDF;
