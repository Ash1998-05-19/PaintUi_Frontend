import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
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

  // Helper function to load font as base64
  const loadFontAsBase64 = (fontUrl) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      fetch(fontUrl)
        .then((response) => response.blob())
        .then((blob) => {
          reader.onloadend = () => {
            resolve(reader.result.split(",")[1]); // Extract base64 part
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob); // Convert font file to base64
        })
        .catch(reject);
    });
  };

  // Handle PDF generation and font application
  const handleDownload = async () => {
    setIsGenerating(true); // Set generating state to true
    const rep = new jsPDF("p", "pt", "a4");

    try {
      // Load and add font to jsPDF (path adjusted for the public directory)
      const fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf"; // Path to your font file

      rep.addFont(fontUrl, "NotoSansDevanagari", "normal");
      // Log font loaded successfully
      console.log("Font loaded successfully");
      rep.setFont("NotoSansDevanagari");

      // Generate the PDF content from HTML
      rep.html(document.querySelector("#rep1"), {
        callback: function (pdf) {
          pdf.save("report.pdf");
        },
        html2canvas: {
          scale: 1,
          useCORS: true,
        },
        x: 0,
        y: 0,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false); // Reset generating state
    }
  };

  // Check if all QR codes are loaded
  useEffect(() => {
    if (qrCodes.length === data.coupons && qrCodes.every((qr) => qr)) {
      setIsImageLoaded(true); // Enable the button when all QR codes are loaded
    }
  }, [qrCodes, data.coupons]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <>
      <div id="main" style={{ visibility:"hidden", height:"0"}}>
        <div id="rep1" ref={contentRef}>
          {data.coupons?.map((coupon, index) => (
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
                  <h1 className="underline">प्रक्रिया &nbsp;&nbsp;&nbsp;:</h1>
                  <p className="text-justify">
                    अपना कूपन रिडीम करने के लिए अपने नज़दीकी ट्रूबॉन्ड रिटेलर से
                    संपर्क करें और तुरंत कूपन का भुगतान प्राप्त करें।
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
                  <h2 className={`${style.underLineText}`}>नियम और शर्ते &nbsp;:</h2>
                  <ol>
                    <li className="flex ">
                      <span className={`${style.dot}`}>&#x2022;</span>
                      <p>यह योजना केवल चुनिंदा उत्पादों पर ही उपलब्ध है। </p>
                    </li>
                    <li className="flex ">
                      <span className={`${style.dot}`}>&#x2022;</span>
                      <p>
                        यह कूपन केवल अधिकृत डिस्ट्रीब्यूटर पर ही रिडीम किया जा
                        सकेगा।{" "}
                      </p>
                    </li>
                    <li className="flex ">
                      <span className={`${style.dot}`}>&#x2022;</span>
                      <p>
                        एक QR कोड केवल एक ही बार स्कैन करने के लिए मान्य होगा।{" "}
                      </p>
                    </li>
                    <li className="flex ">
                      <span className={`${style.dot}`}>&#x2022;</span>
                      <p>इस कूपन को नकद राशि नहीं माना जा सकता। </p>
                    </li>
                    <li className="flex ">
                      <span className={`${style.dot}`}>&#x2022;</span>
                      <p>कटे-फटे कूपन मान्य नहीं होंगे। </p>
                    </li>
                    <li className="flex ">
                      <span className={`${style.dot}`}>&#x2022;</span>
                      <p>अन्य सभी सामान्य नियम और शर्तें लागू होंगी। </p>
                    </li>
                    <li className="flex ">
                      <span className={`${style.dot}`}>&#x2022;</span>
                      <p>
                        इस कूपन को रिडीम करने की शर्तें कंपनी के पास सुरक्षित
                        हैं, और कंपनी इस योजना में परिवर्तन करने का अधिकार रखती
                        है।{" "}
                      </p>
                    </li>
                    <li className="flex ">
                      <span className={`${style.dot}`}>&#x2022;</span>
                      <p>कंपनी का निर्णय ही सर्वमान्य होगा। </p>
                    </li>
                  </ol>
                </div>
                <div className="px-5">
                  {qrCodes[index] && (
                    <img
                      src={qrCodes[index]}
                      alt={`QR Code for ${coupon.CouponCode}`}
                      className="mt-4"
                      onLoad={handleImageLoad}
                    />
                  )}
                </div>
              </div>
              <small className={`${style.smallText} px-6 pb-2`}>
                *किसी भी सहायता के लिए हमारी हेल्पलाइन पर संपर्क करें - [ +91 79765 74376]*
              </small>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleDownload} disabled={!isImageLoaded}>
        {isGenerating ? "Generating PDF..." : "Download PDF"}
      </button>
    </>
  );
};

export default GeneratePDF;
