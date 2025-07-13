
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FilePlus2 } from "lucide-react";
import PptxGenJS from "pptxgenjs";
import jsPDF from "jspdf";

const curriculum = {
  "Baitang 1": ["Pamilya", "Komunidad", "Simbahan at Paaralan"],
  "Baitang 2": ["Kasaysayan ng Barangay", "Mga Tradisyon at Paniniwala"],
  "Baitang 3": ["Heograpiya ng Pilipinas", "Mga Lalawigan"],
  "Baitang 4": ["Rehiyon sa Pilipinas", "Kultura ng mga Rehiyon"],
  "Baitang 5": ["Panahon ng Kastila", "Panahon ng Amerikano"],
  "Baitang 6": ["Paglaya ng Pilipinas", "Kontemporaryong Isyu"],
  "Baitang 7": ["Asya: Heograpiya at Kultura", "Kabihasnang Asyano"],
  "Baitang 8": ["Kasaysayan ng Daigdig", "Rebolusyong Industriyal"],
  "Baitang 9": ["Ekonomiks", "Mga Pangunahing Sektor ng Ekonomiya"],
  "Baitang 10": ["Karapatang Pantao", "Pagkamamamayan at Globalisasyon"]
};

const objectivesMap = {
  "Pamilya": "Maipaliwanag ang kahalagahan ng pamilya sa lipunan.",
  "Komunidad": "Matukoy ang mga bahagi at tungkulin sa komunidad.",
  "Simbahan at Paaralan": "Maunawaan ang papel ng simbahan at paaralan sa paghubog ng pagkatao.",
  "Heograpiya ng Pilipinas": "Matukoy ang lokasyon at katangiang pisikal ng Pilipinas.",
  "Panahon ng Kastila": "Maipaliwanag ang epekto ng kolonyalismong Espanyol sa Pilipinas.",
  "Karapatang Pantao": "Maunawaan ang kahalagahan ng karapatang pantao sa demokratikong lipunan."
};

const generateLessonPlan = (topic) => {
  const objective = objectivesMap[topic] || `Matutunan ng mga mag-aaral ang pangunahing kaalaman tungkol sa ${topic}.`;
  return `Lesson Plan for: ${topic}

Objective:
- ${objective}

Materials:
- PowerPoint presentation
- Worksheets
- Chalkboard/Whiteboard

Procedure:
1. Simula (Motivation)
2. Talakayan (Discussion)
3. Pagsasanay (Activity)
4. Paglalahat (Generalization)
5. Ebalwasyon (Evaluation)`;
};

const generatePPT = (topic) => {
  return `PowerPoint Slides - ${topic}

Slide 1: Pamagat at Layunin
Slide 2: Panimula sa ${topic}
Slide 3: Pangunahing Konsepto
Slide 4: Halimbawa o Kaso
Slide 5: Tanong sa Talakayan
Slide 6: Buod at Ebalwasyon`;
};

const generatePPTX = (topic, imageFiles) => {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'A4', width: 8.27, height: 11.69 });
  pptx.layout = 'A4';

  const slides = [
    { title: topic, content: "Layunin ng Aralin" },
    { title: "Panimula", content: `Pangkalahatang ideya tungkol sa ${topic}` },
    { title: "Pangunahing Konsepto", content: "Ipakita ang mahahalagang impormasyon dito." },
    { title: "Halimbawa", content: "Gamitin ang konkretong sitwasyon o larawan." },
    { title: "Talakayan", content: "Maglagay ng mga tanong upang talakayin." },
    { title: "Buod at Ebalwasyon", content: "I-review ang mga natutunan." }
  ];

  slides.forEach(({ title, content }, index) => {
    const slide = pptx.addSlide();
    slide.addText(title, { x: 0.5, y: 0.3, fontSize: 24, bold: true });
    slide.addText(content, { x: 0.5, y: 1.2, fontSize: 18, color: "363636" });

    const matchingImages = imageFiles.filter(img => img.slideIndex === index);
    matchingImages.forEach((img, i) => {
      slide.addImage({ path: img.dataUrl, x: 0.5 + (i * 4.2), y: 3, w: 4, h: 3 });
    });
  });

  pptx.writeFile(`${topic}-Interactive_PPT.pptx`);
};

const downloadPDF = (filename, content) => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 15, 20);
  doc.save(filename);
};

export default function AralingPanlipunanApp() {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [lessonPlan, setLessonPlan] = useState("");
  const [pptContent, setPPTContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  const handleGenerate = () => {
    if (selectedTopic) {
      setLessonPlan(generateLessonPlan(selectedTopic));
      setPPTContent(generatePPT(selectedTopic));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileReaders = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const slideIndex = parseInt(prompt("Enter slide number to place this image (1–6):"), 10) - 1;
          resolve({ dataUrl: reader.result, slideIndex: isNaN(slideIndex) ? 3 : slideIndex });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then((images) => {
      setImageFiles((prev) => [...prev, ...images]);
    });
  };

  const downloadFile = (filename, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Araling Panlipunan (Matatag Curriculum)</h1>
      {/* UI buttons and logic omitted for brevity */}
    </div>
  );
}
