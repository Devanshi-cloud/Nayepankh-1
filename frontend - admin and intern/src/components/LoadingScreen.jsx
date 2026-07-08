import React, { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import mainLogo from "../assets/NayePankh-logo.png";

const LoadingScreen = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const heartRef = useRef(null);
  const coinContainerRef = useRef(null);

  useEffect(() => {
    const animations = [];

    // 1. Percentage counter animation
    const obj = { value: 0 };
    const pctAnim = gsap.to(obj, {
      value: 100,
      duration: 2.5,
      ease: "power1.inOut",
      onUpdate: () => {
        setPercent(Math.floor(obj.value));
      },
      onComplete: () => {
        // Fade out transition after hitting 100%
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: onComplete,
          });
        }
      },
    });
    animations.push(pctAnim);

    // 2. Logo entrance
    if (logoRef.current) {
      const logoAnim1 = gsap.fromTo(
        logoRef.current,
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
      animations.push(logoAnim1);

      // Continuous Logo Heartbeat / Pulse
      const logoAnim2 = gsap.to(logoRef.current, {
        scale: 1.05,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      animations.push(logoAnim2);
    }

    // 3. Heart heartbeat animation
    if (heartRef.current) {
      const heartAnim = gsap.to(heartRef.current, {
        scale: 1.25,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
      animations.push(heartAnim);
    }

    // 4. Floating Coins/Hearts animation
    const coinContainer = coinContainerRef.current;
    if (coinContainer) {
      for (let i = 0; i < 15; i++) {
        const item = document.createElement("div");
        const isHeart = Math.random() > 0.5;
        
        item.style.position = "absolute";
        item.style.bottom = "-50px";
        item.style.left = `${Math.random() * 100}%`;
        item.style.fontSize = `${16 + Math.random() * 20}px`;
        item.style.userSelect = "none";
        item.style.pointerEvents = "none";
        item.innerText = isHeart ? "❤️" : "🪙";
        coinContainer.appendChild(item);

        const floatAnim = gsap.to(item, {
          y: -window.innerHeight - 100,
          x: (Math.random() - 0.5) * 150,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 1.2,
          ease: "power1.out",
          opacity: 0,
          onComplete: () => {
            if (coinContainer.contains(item)) {
              coinContainer.removeChild(item);
            }
          },
        });
        animations.push(floatAnim);
      }
    }

    // Cleanup: kill all animations on unmount
    return () => {
      animations.forEach((anim) => {
        if (anim && typeof anim.kill === "function") {
          anim.kill();
        }
      });
    };
  }, [onComplete]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "#ffffff",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background container for floating particles */}
      <Box
        ref={coinContainerRef}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Main Logo Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
          position: "relative",
        }}
      >
        <Box
          ref={logoRef}
          sx={{
            width: 180,
            height: 150,
            bgcolor: "#fff",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.06)",
            borderRadius: 3,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <img
            src={mainLogo}
            alt="NayePankh Foundation"
            style={{ width: "90%", height: "auto", objectFit: "contain" }}
          />
        </Box>

        {/* Pulse Heart */}
        <Typography
          ref={heartRef}
          sx={{
            fontSize: "2rem",
            mb: 2,
            display: "inline-block",
          }}
        >
          ❤️
        </Typography>

        {/* Percentage Counter */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#216eb6",
            fontFamily: "'Poppins', sans-serif",
            mb: 2,
          }}
        >
          {percent}%
        </Typography>

        {/* Progress Bar Container */}
        <Box
          sx={{
            width: "280px",
            height: 8,
            bgcolor: "#e0e0e0",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              width: `${percent}%`,
              height: "100%",
              bgcolor: "#216eb6",
              backgroundImage: "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
              backgroundSize: "1rem 1rem",
              borderRadius: 4,
              transition: "width 0.1s linear",
            }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            mt: 2,
            color: "#546E7A",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Creating wings for dreams...
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
