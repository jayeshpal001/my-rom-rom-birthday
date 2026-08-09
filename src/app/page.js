"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Power,
  Music,
  ChevronRight,
  Flame,
  Heart,
  Film,
  Users,
} from "lucide-react";

export default function SmoothCinematicJourney() {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [polaroidIndex, setPolaroidIndex] = useState(0);
  const [activeVid, setActiveVid] = useState(0);
  const [isRubbed, setIsRubbed] = useState(false);

  // Audio Refs
  const audioRef = useRef(null);
  const hbdAudioRef = useRef(null);
  const canvasRef = useRef(null);

  const polaroids = [
    {
      id: 1,
      text: "The one where you actually look cute 🐒",
      color: "bg-rose-100",
      img: "/photo4.jpeg",
    },
    {
      id: 2,
      text: "Capturing your raw, unfiltered drama 😂",
      color: "bg-blue-100",
      img: "/photo2.jpg",
    },
    {
      id: 3,
      text: "My absolute favorite headache ❤️",
      color: "bg-purple-100",
      img: "/photo1.jpg",
    },
    {
      id: 4,
      text: "Partner in all my stupid crimes 🕵️‍♀️",
      color: "bg-green-100",
      img: "/photo3.jpg",
    },
 
  ];

  const bgBalloons = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    xOffset: (i * 17) % 100,
    delay: (i * 0.3) % 3,
    duration: 7 + (i % 5),
    color: [
      "bg-rose-400",
      "bg-blue-400",
      "bg-yellow-400",
      "bg-green-400",
      "bg-purple-400",
    ][i % 5],
    textColor: [
      "text-rose-400",
      "text-blue-400",
      "text-yellow-400",
      "text-green-400",
      "text-purple-400",
    ][i % 5],
  }));

  // ⚡ DYNAMIC BALLOON ROW GENERATOR FOR LONG TEXT
  const balloonRowsData = ["HAPPY", "BIRTHDAY", "MY", "ROM ROM"];
  let charCount = 0;
  const coloredRows = balloonRowsData.map((row) => {
    return row.split("").map((char) => {
      if (char === " ") return { char: " ", isSpace: true };
      const delay = charCount * 0.15; // 0.15s gap between each letter pop
      charCount++;
      const colorIdx = charCount % 5;
      return {
        char,
        delay,
        color: [
          "bg-rose-500",
          "bg-blue-500",
          "bg-yellow-500",
          "bg-purple-500",
          "bg-green-500",
        ][colorIdx],
        textColor: [
          "text-rose-500",
          "text-blue-500",
          "text-yellow-500",
          "text-purple-500",
          "text-green-500",
        ][colorIdx],
      };
    });
  });

  const buzz = (type = "light") => {
    if (!navigator.vibrate) return;
    if (type === "light") navigator.vibrate(50);
    if (type === "heavy") navigator.vibrate([100, 50, 100]);
  };

  const turnOnLights = () => {
    buzz("heavy");
    setTimeout(() => setStage(1), 800);
  };

  const playMusic = () => {
    buzz("light");
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.play();
    }
    setTimeout(() => setStage(2), 2500);
  };

  const triggerDecor = () => {
    buzz("heavy");
    setTimeout(() => setStage(3), 1000);
  };

  const lightCandle = () => {
    buzz("heavy");
    setStage(4);

    if (hbdAudioRef.current) {
      hbdAudioRef.current.volume = 1.0;
      hbdAudioRef.current.currentTime = 0;
      hbdAudioRef.current.play();
    }

    if (audioRef.current) {
      let vol = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        if (vol > 0.1) {
          vol -= 0.1;
          audioRef.current.volume = vol;
        } else {
          audioRef.current.volume = 0;
          audioRef.current.pause();
          clearInterval(fadeOut);
        }
      }, 100);
    }

    setTimeout(() => {
      setStage(5);
      if (hbdAudioRef.current) {
        hbdAudioRef.current.pause();
      }

      if (audioRef.current) {
        audioRef.current.play();
        let vol = 0;
        const fadeIn = setInterval(() => {
          if (vol < 0.9) {
            vol += 0.1;
            audioRef.current.volume = vol;
          } else {
            audioRef.current.volume = 1.0;
            clearInterval(fadeIn);
          }
        }, 200);
      }
    }, 7000);
  };

  useEffect(() => {
    if (stage === 6) {
      const interval = setInterval(() => {
        setActiveVid((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            setTimeout(() => setStage(7), 10000);
            return prev;
          }
          return prev + 1;
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 7 && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
      ctx.fillRect(0, 0, 300, 400);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "20px serif";
      ctx.textAlign = "center";
      ctx.fillText("Rub gently to clear...", 150, 200);
    }
  }, [stage]);

  const handleScratch = (e) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    if (Math.random() > 0.8 && navigator.vibrate) navigator.vibrate(10);
    if (!isRubbed) setTimeout(() => setIsRubbed(true), 2500);
  };

  return (
    <main
      className={`w-screen h-[100dvh] overflow-hidden transition-colors duration-[2000ms] ease-in-out flex flex-col items-center justify-center font-sans select-none touch-none ${stage === 0 || stage === 6 ? "bg-black" : "bg-[#fff5f5]"}`}
    >
      <audio ref={audioRef} src="/your-song.mp3" loop />
      <audio ref={hbdAudioRef} src="/happy-birthday-tune.mp3" />

      {/* STAGE 0 */}
      <AnimatePresence>
        {stage === 0 && (
          <motion.div exit={{ opacity: 0, transition: { duration: 1.5 } }} className="flex flex-col items-center text-white z-50">
            <h2 className="text-xl font-bold mb-12 tracking-widest text-gray-400">PURA ANDHERA HAI...</h2>
            <div className="w-16 h-40 bg-gray-900 rounded-full p-2 relative shadow-inner border border-gray-800">
              <motion.div drag="y" dragConstraints={{ top: 0, bottom: 90 }} dragElastic={0.1} onDragEnd={(e, info) => { if (info.offset.y > 60) turnOnLights(); }} className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center cursor-grab shadow-lg">
                <Power className="w-6 h-6 text-gray-900" />
              </motion.div>
              <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap animate-pulse">Drag Down Slowly</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage >= 1 && stage <= 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.5 } }} exit={{ opacity: 0, transition: { duration: 1.5 } }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden">
            
            {/* STAGE 1 */}
            {stage === 1 && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { duration: 1 } }} exit={{ scale: 1.2, opacity: 0, transition: { duration: 1 } }} className="flex flex-col items-center z-20">
                <h2 className="text-xl font-bold text-gray-700 mb-8 font-serif">Sound ON zaroori hai!</h2>
                <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 50) playMusic(); }} animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ repeat: isPlaying ? Infinity : 0, duration: 4, ease: "linear" }} className="w-40 h-40 bg-black rounded-full border-4 border-gray-800 flex items-center justify-center shadow-2xl cursor-grab">
                  <div className="w-12 h-12 bg-rose-400 rounded-full flex items-center justify-center border-2 border-white"><Music className="w-5 h-5 text-white" /></div>
                </motion.div>
                <p className="mt-8 text-sm text-gray-500 animate-pulse">Swipe record to play 🎵</p>
              </motion.div>
            )}

            {/* STAGE 2 */}
            {stage === 2 && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { duration: 1 } }} exit={{ scale: 1.2, opacity: 0, transition: { duration: 1 } }} className="flex flex-col items-center z-20">
                <h2 className="text-xl font-bold text-gray-700 mb-12 font-serif">Sajawat toh banti hai...</h2>
                <div className="w-64 h-14 bg-white rounded-full p-1 relative shadow-lg flex items-center overflow-hidden border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium z-0 pointer-events-none">Slide to Decorate</div>
                  <motion.div drag="x" dragConstraints={{ left: 0, right: 200 }} dragElastic={0.1} onDragEnd={(e, info) => { if (info.offset.x > 150) triggerDecor(); }} className="w-12 h-12 bg-rose-400 rounded-full flex items-center justify-center z-10 cursor-grab shadow-md transition-all">
                    <ChevronRight className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3 & 4 */}
            {stage >= 3 && (
              <>
                {bgBalloons.map((b) => (
                  <motion.div key={`bg-bal-${b.id}`} initial={{ y: "100vh", x: 0 }} animate={{ y: "-120vh", x: [0, 20, -20, 0] }} transition={{ y: { duration: b.duration, repeat: Infinity, delay: b.delay, ease: "linear" }, x: { duration: 4, repeat: Infinity, ease: "easeInOut" } }} className={`absolute w-12 h-16 rounded-[50%] opacity-60 z-0 ${b.color}`} style={{ left: `${b.xOffset}%` }}>
                    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-transparent border-b-current ${b.textColor}`}></div>
                    <div className="absolute -bottom-10 left-1/2 w-[1px] h-10 bg-gray-400/40"></div>
                  </motion.div>
                ))}

                {/* ⚡ THE NEW 3-ROW BALLOONS SYSTEM */}
                <div className="absolute top-10 flex flex-col items-center gap-1 sm:gap-2 z-10 w-full px-2">
                  {coloredRows.map((row, rIndex) => (
                    <div key={`row-${rIndex}`} className="flex justify-center gap-1 sm:gap-1.5 w-full">
                      {row.map((b, i) => {
                        if (b.isSpace) return <div key={`space-${i}`} className="w-2 sm:w-3" />;
                        return (
                          <motion.div
                            key={`let-${rIndex}-${i}`}
                            initial={{ y: "100vh", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                              duration: 1.5,
                              ease: "easeOut",
                              delay: 1 + b.delay,
                            }}
                            className="relative flex flex-col items-center"
                          >
                            <div
                              className={`w-[26px] h-[36px] sm:w-8 sm:h-12 rounded-[50%] flex items-center justify-center text-white font-extrabold text-xs sm:text-sm shadow-xl border border-white/30 ${b.color}`}
                            >
                              {b.char}
                              <div
                                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-transparent border-b-current ${b.textColor}`}
                              ></div>
                            </div>
                            <div className="w-[1px] h-6 sm:h-8 bg-gray-400 opacity-50"></div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {stage === 3 && (
                  <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0, transition: { duration: 1.5, delay: 0.5 } }} exit={{ opacity: 0, transition: { duration: 1 } }} className="absolute bottom-28 flex flex-col items-center z-20">
                    <div className="text-8xl filter drop-shadow-2xl mb-12">🎂</div>
                    <div className="w-20 h-40 relative flex flex-col items-center justify-end border-2 border-dashed border-gray-400/50 rounded-xl p-2 bg-white/30 backdrop-blur-sm">
                      <p className="absolute -top-8 text-xs text-gray-600 font-bold w-32 text-center">Swipe Up to Light</p>
                      <motion.div drag="y" dragConstraints={{ top: -100, bottom: 0 }} dragElastic={0.1} onDragEnd={(e, info) => { if (info.offset.y < -50) lightCandle(); }} className="w-4 h-16 bg-yellow-700 rounded-sm relative cursor-grab z-30 flex flex-col items-center">
                        <div className="w-5 h-6 bg-red-500 rounded-t-full absolute -top-4"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {stage >= 4 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.5 } }} className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                    <div className="absolute bottom-40 text-8xl filter drop-shadow-2xl">
                      🎂
                      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [1, 1.1, 1], opacity: 1, transition: { duration: 2, repeat: Infinity } }} className="absolute top-[-10px] left-1/2 -translate-x-1/2 text-orange-500 z-10">
                        <Flame className="w-10 h-10 fill-orange-500" />
                      </motion.div>
                    </div>
                    {stage === 4 && <MessageSequence onComplete={() => setStage(5)} />}
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 5 */}
      <AnimatePresence>
        {stage === 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.5 } }} exit={{ opacity: 0, transition: { duration: 1.5 } }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-40 bg-[#fff5f5]">
            <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition: { duration: 1, delay: 0.5 } }} className="text-2xl font-bold text-rose-500 mb-8 flex items-center gap-2"><Heart className="w-6 h-6" /> Our Memories</motion.h2>
            <div className="relative w-full max-w-[280px] h-[380px]">
              {polaroids.map((card, index) => {
                const isTop = index === polaroidIndex;
                if (index < polaroidIndex) return null;
                return (
                  <motion.div key={card.id} drag={isTop ? "x" : false} dragConstraints={{ left: 0, right: 0 }} onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 100) { setPolaroidIndex((prev) => prev + 1); buzz("light"); if (index === polaroids.length - 1) setTimeout(() => setStage(6), 2000); } }} initial={{ scale: 1 - (index - polaroidIndex) * 0.05, y: (index - polaroidIndex) * 10, opacity: 0 }} animate={{ scale: 1 - (index - polaroidIndex) * 0.05, y: (index - polaroidIndex) * 15, zIndex: 10 - index, opacity: 1, transition: { duration: 0.8 } }} exit={{ x: (info) => (info.offset?.x > 0 ? 300 : -300), opacity: 0, transition: { duration: 0.5 } }} className={`absolute inset-0 w-full h-full p-4 pb-10 bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`} style={{ rotate: isTop ? 0 : index % 2 === 0 ? 3 : -3 }}>
                    <div className={`w-full flex-1 relative rounded-lg mb-4 overflow-hidden ${card.color}`}>
                      <img src={card.img} alt="Memory" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <p className="text-center text-gray-800 font-medium font-serif line-clamp-2">{card.text}</p>
                    {isTop && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1 } }} className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-400">Swipe gently &rarr;</motion.span>}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 6 */}
      <AnimatePresence>
        {stage === 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 2 } }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-50 bg-[#050505]"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 1, delay: 1 } }}
              className="absolute top-12 text-white/40 tracking-[0.3em] text-xs flex items-center gap-2 font-mono z-50"
            >
              <Film className="w-4 h-4" /> PLAYING MEMORIES...
            </motion.div>

            <div className="relative w-full h-[70vh] overflow-hidden flex items-center">
              <motion.div
                className="flex w-[400vw] h-full"
                animate={{ x: `-${activeVid * 100}vw` }}
                transition={{ type: "tween", ease: "easeInOut", duration: 1.5 }}
              >
                {[1, 2, 3, 4].map((vid) => (
                  <div key={vid} className="w-[100vw] h-full flex items-center justify-center px-4">
                    <div className="w-[280px] h-[480px] bg-[#1a1a1a] p-3 relative shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between border border-[#222]">
                      <div className="w-full flex justify-between px-1">
                        {[...Array(7)].map((_, i) => (
                          <div key={`t-${i}`} className="w-4 h-5 bg-[#050505] rounded-sm shadow-inner"></div>
                        ))}
                      </div>

                      <div className="w-full h-[380px] bg-black relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                        <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"></div>
                        <div className="absolute inset-0 z-10 pointer-events-none bg-orange-900/10 mix-blend-color-burn"></div>
                        
                        <video
                          src={`/video${vid}.mp4`}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-50 sepia-[30%]"
                        />
                      </div>

                      <div className="w-full flex justify-between px-1">
                        {[...Array(7)].map((_, i) => (
                          <div key={`b-${i}`} className="w-4 h-5 bg-[#050505] rounded-sm shadow-inner"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 7 */}
      <AnimatePresence>
        {stage === 7 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 2 } }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-50 bg-[#fff5f5]">
            <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0, transition: { delay: 1, duration: 1 } }} className="text-2xl font-bold text-rose-500 mb-2 text-center flex items-center gap-2"><Users className="w-6 h-6" /> The Gang</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }} className="text-gray-500 text-sm mb-6 text-center italic">"Waqt ke sath yaadein dhundhli ho jati hain. Saaf karke dekh..."</motion.p>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: 0.5, duration: 1.5 } }} className="relative w-[90%] max-w-[300px] h-[400px] bg-white p-3 rounded-3xl shadow-2xl touch-none">
              <div className="absolute inset-3 rounded-2xl overflow-hidden bg-black flex items-center justify-center text-white/50">
                <img src="/group-photo.jpeg" alt="The Gang" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <canvas ref={canvasRef} width={276} height={376} onMouseMove={handleScratch} onTouchMove={handleScratch} className="absolute top-3 left-3 w-[calc(100%-24px)] h-[calc(100%-24px)] z-10 cursor-pointer rounded-2xl transition-opacity duration-1000" />
            </motion.div>
            <AnimatePresence>
              {isRubbed && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 1 } }} className="mt-8 text-center w-full px-6">
                  <p className="text-gray-700 font-bold text-xl mb-4">Happy Birthday Rom Rom! 🎉</p>
                  <p className="text-gray-500 text-sm mb-6">Tu duniya ki sabse badi nautanki hai, par hamare group ki jaan hai. Love you!</p>
                  <button onClick={() => confetti({ particleCount: 300, spread: 150, origin: { y: 0.6 }, colors: ["#f43f5e", "#fb923c", "#3b82f6"] }) } className="w-full bg-gradient-to-r from-rose-400 to-orange-400 text-white py-3 rounded-xl font-bold shadow-xl active:scale-95 transition-transform duration-300">Celebrate! 🎁</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function MessageSequence({ onComplete }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = ["Today is...", "As beautiful as other days", "But you realize...", "Another year has gone", "Do you know?", "Today is just special...", "Because of YOU, Rom Rom ❤️"];
  useEffect(() => {
    if (msgIndex < messages.length) {
      const timer = setTimeout(() => setMsgIndex((prev) => prev + 1), 5000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => onComplete(), 1000);
    }
  }, [msgIndex, onComplete, messages.length]);
  return (
    <div className="absolute bottom-20 w-full text-center px-6 pointer-events-none z-50">
      <AnimatePresence mode="wait">
        <motion.p key={msgIndex} initial={{ opacity: 0, y: 10, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }} exit={{ opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.8, ease: "easeIn" } }} className="text-2xl font-serif font-bold text-gray-800 italic tracking-wide drop-shadow-md">
          {messages[msgIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}