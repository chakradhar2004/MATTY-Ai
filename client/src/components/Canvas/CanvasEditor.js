import React, { useRef, useState, useEffect, useCallback } from 'react';
import './CanvasEditor.css';
import { Stage, Layer, Text, Rect, Circle, RegularPolygon, Image as KonvaImage, Transformer, Line, Arrow, Star, Ellipse, Ring } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import { saveDesign, updateDesign } from '../../store/slices/designSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import useImage from 'use-image';
import { uploadAPI } from '../../services/api';
import { setExportRequest } from '../../store/slices/canvasSlice';
import { FaUndo, FaRedo, FaTrash, FaFont, FaSquare, FaCircle, FaCaretUp, FaImage, FaSave, FaDownload, FaArrowLeft, FaBold, FaItalic, FaFilePdf, FaSpinner, FaMinus, FaArrowRight, FaGem, FaStar, FaPalette, FaPlay, FaStop, FaHeart, FaShapes, FaChevronDown, FaEllipsisH, FaFileImage, FaDraftingCompass, FaChevronUp, FaMousePointer, FaHandPaper } from 'react-icons/fa';


// This function is no longer used - text editing is handled by the component's internal methods


// This function is no longer used - color changes are handled by the component's internal methods

// Helper component to render images from a src URL
const ImageNode = ({ element, commonProps }) => {
  const [img] = useImage(element.src, 'anonymous');
  return (
    <KonvaImage
      {...commonProps}
      image={img}
      width={element.width}
      height={element.height}
      x={element.x}
      y={element.y}
      opacity={element.opacity}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
    />
  );
};

const CanvasEditor = ({ initialWidth = 800, initialHeight = 600 }) => {
  const stageRef = useRef();
  const fileInputRef = useRef();
  const transformerRef = useRef();

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPosition, setEditPosition] = useState({ x: 0, y: 0 });
  const [editingElement, setEditingElement] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedFontFamily, setSelectedFontFamily] = useState('Arial');
  const [selectedFontSize, setSelectedFontSize] = useState(20);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [showTextDropdown, setShowTextDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDraft, setIsDraft] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [enableShadow, setEnableShadow] = useState(false);
  const [shadowBlur, setShadowBlur] = useState(5);
  const [shadowOffsetX, setShadowOffsetX] = useState(5);
  const [shadowOffsetY, setShadowOffsetY] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [clipboard, setClipboard] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  // Canvas state
  const [stageSize, setStageSize] = useState({
    width: initialWidth,
    height: initialHeight
  });
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [activeTool, setActiveTool] = useState('select');
  const [gridSize, setGridSize] = useState(20);
  const [objects, setObjects] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { canvasWidth: locationWidth, canvasHeight: locationHeight } = location.state || {};
  const { currentDesign } = useSelector((state) => state.design);
  const { preferences } = useSelector((state) => state.ui);
  const exportRequest = useSelector((state) => state.canvas.exportRequest);

  const canvasWidth = locationWidth || (currentDesign ? window.innerWidth : 800);
  const canvasHeight = locationHeight || (currentDesign ? (window.innerHeight - 112) : 600);

  // Load design if editing existing one
  useEffect(() => {
    if (currentDesign && currentDesign.jsonData) {
      const loadedElements = currentDesign.jsonData.elements || [];
      setElements(loadedElements);
      saveToHistory(loadedElements);
    }
  }, [currentDesign]);

  // Handle transformer for selected elements
  useEffect(() => {
    if (selectedId && stageRef.current) {
      const selectedNode = stageRef.current.findOne('#' + selectedId);
      if (selectedNode && transformerRef.current) {
        // Clear previous nodes
        transformerRef.current.nodes([]);
        // Add the selected node
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, elements]);

  // Keyboard shortcuts: undo/redo/delete/copy/paste/save/export
  useEffect(() => {
    const onKeyDown = (e) => {
      // Don't handle keyboard shortcuts when editing text
      if (isEditing) {
        // Allow Escape to cancel editing
        if (e.key === 'Escape') {
          updateText();
        }
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;
      
      // Bold/Italic/Underline shortcuts when text is selected
      if (selectedId) {
        const selectedElement = elements.find(el => el.id === selectedId);
        if (selectedElement?.type === 'text') {
          if (isCtrl && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            const newBold = !isBold;
            setIsBold(newBold);
            const updated = elements.map((el) => 
              el.id === selectedId ? { ...el, fontWeight: newBold ? 'bold' : 'normal' } : el
            );
            setElements(updated);
            saveToHistory(updated);
            setIsDraft(true);
            return;
          }
          if (isCtrl && e.key.toLowerCase() === 'i') {
            e.preventDefault();
            const newItalic = !isItalic;
            setIsItalic(newItalic);
            const updated = elements.map((el) => 
              el.id === selectedId ? { ...el, fontStyle: newItalic ? 'italic' : 'normal' } : el
            );
            setElements(updated);
            saveToHistory(updated);
            setIsDraft(true);
            return;
          }
          if (isCtrl && e.key.toLowerCase() === 'u') {
            e.preventDefault();
            const newUnderline = !isUnderline;
            setIsUnderline(newUnderline);
            const updated = elements.map((el) => 
              el.id === selectedId ? { ...el, textDecoration: newUnderline ? 'underline' : '' } : el
            );
            setElements(updated);
            saveToHistory(updated);
            setIsDraft(true);
            return;
          }
        }
      }

      // Global shortcuts
      if (isCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (isCtrl && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        handleRedo();
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          handleDelete();
        }
        return;
      }
      if (isCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveComplete();
        return;
      }
      if (isCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        const el = elements.find((x) => x.id === selectedId);
        if (el) setClipboard({ ...el, id: Date.now().toString(), x: (el.x || 0) + 15, y: (el.y || 0) + 15 });
        return;
      }
      if (isCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        if (clipboard) {
          const newElements = [...elements, { ...clipboard, id: Date.now().toString() }];
          setElements(newElements);
          saveToHistory(newElements);
          setIsDraft(true);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [elements, selectedId, clipboard, historyStep, history, isEditing]);

  // Update property controls when selection changes
  useEffect(() => {
    if (selectedId && !isEditing) {  // Don't update styles when editing
      const selectedElement = elements.find(el => el.id === selectedId);
      if (selectedElement) {
        if (selectedElement.type === 'text') {
          setSelectedFontFamily(selectedElement.fontFamily || 'Arial');
          setSelectedFontSize(selectedElement.fontSize || selectedFontSize);
          setIsBold(selectedElement.fontWeight === 'bold');
          setIsItalic(selectedElement.fontStyle === 'italic');
          setIsUnderline(selectedElement.textDecoration === 'underline');
          setTextAlign(selectedElement.align || 'left');
          setSelectedColor(selectedElement.fill || selectedColor);
        }
        // Sync color for non-text elements as well
        if (selectedElement.type !== 'text') {
          // Prefer fill, fall back to stroke
          const col = selectedElement.fill || selectedElement.stroke;
          if (col) setSelectedColor(col);
        }
        setShadowColor(selectedElement.shadowColor || '#000000');
        setShadowBlur(selectedElement.shadowBlur || 5);
        setShadowOffsetX(selectedElement.shadowOffsetX || 5);
        setShadowOffsetY(selectedElement.shadowOffsetY || 5);
        setOpacity(selectedElement.opacity || 1);
        setRotation(selectedElement.rotation || 0);
      }
    }
  }, [selectedId, elements, isEditing, selectedFontSize, selectedColor]);

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowShapeDropdown(false);
        setShowTextDropdown(false);
        setShowColorPicker(false);
        setShowExportMenu(false);
        setShowSaveMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const saveToHistory = (newElements) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements([...history[historyStep - 1]]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements([...history[historyStep + 1]]);
    }
  };

  const handleAddText = () => {
    const newText = {
      id: Date.now().toString(),
      type: 'text',
      x: (stageSize.width / 2) - 50, // Center the text by default
      y: (stageSize.height / 2) - 10,
      text: 'New Text',
      fontSize: selectedFontSize,
      fontFamily: selectedFontFamily,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : '',
      align: textAlign,
      fill: selectedColor,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    
    // If we're zoomed or panned, adjust the position
    if (zoom !== 1 || panX !== 0 || panY !== 0) {
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      if (pointer) {
        const stageBox = stage.container().getBoundingClientRect();
        const relativeX = (pointer.x - stageBox.left - panX) / zoom;
        const relativeY = (pointer.y - stageBox.top - panY) / zoom;
        newText.x = relativeX;
        newText.y = relativeY;
      }
    }
    const newElements = [...elements, newText];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
    // Immediately enter editing mode for the new text
    setSelectedId(newText.id);
    setEditingId(newText.id);
    setEditText(newText.text);
    setEditPosition({ x: newText.x, y: newText.y });
    setEditingElement(newText);
    setIsEditing(true);
  };

  const handleImageUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append('image', file);
          const response = await uploadAPI.uploadImage(formData);
          const imageUrl = response.data.imageUrl || response.data.secureUrl || response.data.secure_url || response.data.url;

          // Use a temporary Image to compute dimensions
          const tempImg = new window.Image();
          tempImg.crossOrigin = 'anonymous';
          tempImg.src = imageUrl;
          tempImg.onload = () => {
            const maxDim = 300;
            const scale = Math.min(maxDim / tempImg.width, maxDim / tempImg.height, 1);
            const newImage = {
              id: Date.now().toString(),
              type: 'image',
              x: 100,
              y: 100,
              src: imageUrl,
              width: Math.round(tempImg.width * scale),
              height: Math.round(tempImg.height * scale),
              opacity: 1,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
            };
            const newElements = [...elements, newImage];
            setElements(newElements);
            saveToHistory(newElements);
            setIsDraft(true);
            setIsUploading(false);
          };
          tempImg.onerror = () => {
            alert('Failed to load image');
            setIsUploading(false);
          };
        } catch (error) {
          console.error('Image upload failed:', error);
          alert('Image upload failed');
          setIsUploading(false);
        }
      }
    };
    fileInput.click();
  };

  const handleAddRectangle = () => {
    const newRect = {
      id: Date.now().toString(),
      type: 'rect',
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      fill: selectedColor,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newRect];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleAddCircle = () => {
    const newCircle = {
      id: Date.now().toString(),
      type: 'circle',
      x: 200,
      y: 200,
      radius: 50,
      fill: selectedColor,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newCircle];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleAddTriangle = () => {
    const newTriangle = {
      id: Date.now().toString(),
      type: 'triangle',
      x: 250,
      y: 200,
      sides: 3,
      radius: 50,
      fill: selectedColor,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newTriangle];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleAddEllipse = () => {
    const newEllipse = {
      id: Date.now().toString(),
      type: 'ellipse',
      x: 200,
      y: 200,
      radiusX: 80,
      radiusY: 40,
      fill: selectedColor,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newEllipse];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleAddStar = () => {
    const newStar = {
      id: Date.now().toString(),
      type: 'star',
      x: 200,
      y: 200,
      numPoints: 5,
      innerRadius: 25,
      outerRadius: 50,
      fill: selectedColor,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newStar];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleAddHexagon = () => {
    const newHexagon = {
      id: Date.now().toString(),
      type: 'hexagon',
      x: 200,
      y: 200,
      sides: 6,
      radius: 50,
      fill: selectedColor,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newHexagon];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleAddPentagon = () => {
    const newPentagon = {
      id: Date.now().toString(),
      type: 'pentagon',
      x: 200,
      y: 200,
      sides: 5,
      radius: 50,
      fill: selectedColor,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newPentagon];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleAddArrow = () => {
    const newArrow = {
      id: Date.now().toString(),
      type: 'arrow',
      points: [100, 200, 200, 200],
      fill: selectedColor,
      stroke: selectedColor,
      strokeWidth: 4,
      pointerLength: 10,
      pointerWidth: 10,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newArrow];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleAddLine = () => {
    const newLine = {
      id: Date.now().toString(),
      type: 'line',
      points: [100, 150, 200, 150],
      stroke: selectedColor,
      strokeWidth: 3,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newLine];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleAddHeart = () => {
    const newHeart = {
      id: Date.now().toString(),
      type: 'heart',
      x: 200,
      y: 200,
      width: 80,
      height: 80,
      fill: selectedColor,
      opacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    const newElements = [...elements, newHeart];
    setElements(newElements);
    saveToHistory(newElements);
    setIsDraft(true);
  };

  const handleDelete = () => {
    if (selectedId) {
      const newElements = elements.filter((el) => el.id !== selectedId);
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedId(null);
    }
  };

  const handleSaveDraft = async () => {
    const jsonData = { elements };
    try {
      if (currentDesign && currentDesign._id) {
        await dispatch(
          updateDesign({
            designId: currentDesign._id,
            designData: {
              title: currentDesign.title || `Draft-${new Date().toLocaleDateString()}`,
              jsonData,
              isDraft: true,
              canvasWidth: stageSize.width,
              canvasHeight: stageSize.height,
            },
          })
        ).unwrap();
        alert('Draft saved successfully!');
      } else {
        const title = prompt('Enter design title:') || `Draft-${new Date().toLocaleDateString()}`;
        await dispatch(
          saveDesign({
            title,
            jsonData,
            isDraft: true,
            canvasWidth: stageSize.width,
            canvasHeight: stageSize.height,
          })
        ).unwrap();
        alert('Draft saved successfully!');
      }
      setIsDraft(false);
    } catch (error) {
      alert('Failed to save draft');
    }
  };

  const handleSaveComplete = async () => {
    const jsonData = { elements };
    let thumbnailUrl = null;

    // Generate and upload thumbnail
    if (stageRef.current) {
      const canvas = stageRef.current.toCanvas();
      const thumbnailCanvas = document.createElement('canvas');
      thumbnailCanvas.width = 200;
      thumbnailCanvas.height = 200;
      const ctx = thumbnailCanvas.getContext('2d');
      const scale = Math.min(200 / canvas.width, 200 / canvas.height);
      const scaledWidth = canvas.width * scale;
      const scaledHeight = canvas.height * scale;
      const x = (200 - scaledWidth) / 2;
      const y = (200 - scaledHeight) / 2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 200, 200);
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, x, y, scaledWidth, scaledHeight);
      const thumbnailDataURL = thumbnailCanvas.toDataURL('image/png');
      const blob = dataURLtoBlob(thumbnailDataURL);
      try {
        const formData = new FormData();
        formData.append('image', blob, 'thumbnail.png');
        const uploadRes = await uploadAPI.uploadImage(formData);
        thumbnailUrl = uploadRes.data.url || uploadRes.data.secure_url;
      } catch (error) {
        console.error('Thumbnail upload failed', error);
      }
    }

    try {
      if (currentDesign && currentDesign._id) {
        await dispatch(
          updateDesign({
            designId: currentDesign._id,
            designData: {
              title: currentDesign.title || 'Untitled Design',
              jsonData,
              thumbnailUrl,
              isDraft: false,
              canvasWidth: stageSize.width,
              canvasHeight: stageSize.height,
            },
          })
        ).unwrap();
      } else {
        const title = prompt('Enter design title:') || 'Untitled Design';
        await dispatch(
          saveDesign({
            title,
            jsonData,
            thumbnailUrl,
            isDraft: false,
            canvasWidth: stageSize.width,
            canvasHeight: stageSize.height,
          })
        ).unwrap();
      }
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to save design');
    }
  };

  // Helper function to convert data URL to blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleExportPNG = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // ensure design is saved to dashboard after export
    handleSaveComplete();
  };

  const handleExportJPG = () => {
    const uri = stageRef.current.toDataURL({ mimeType: 'image/jpeg', quality: 1 });
    const link = document.createElement('a');
    link.download = 'design.jpg';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleSaveComplete();
  };

  const handleExportPDF = () => {
    if (stageRef.current) {
      const canvas = stageRef.current.toCanvas();
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgAspect = canvas.width / canvas.height;
      const pdfAspect = pdfWidth / pdfHeight;
      
      let imgWidth, imgHeight;
      if (imgAspect > pdfAspect) {
        imgWidth = pdfWidth;
        imgHeight = pdfWidth / imgAspect;
      } else {
        imgHeight = pdfHeight;
        imgWidth = pdfHeight * imgAspect;
      }
      
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save('design.pdf');
      // ensure design is saved to dashboard after export
      handleSaveComplete();
    }
  };

  const renderElement = (element) => {
    const updatePosition = (e) => {
      const updated = elements.map((el) =>
        el.id === element.id ? { ...el, x: e.target.x(), y: e.target.y() } : el
      );
      setElements(updated);
      saveToHistory(updated);
      setIsDraft(true);
    };

    const handleTransformEnd = (e) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const rotation = node.rotation();
      
      // Reset scale on node
      node.scaleX(1);
      node.scaleY(1);
      
      const updated = elements.map((el) => {
        if (el.id === element.id) {
          if (el.type === 'text') {
            return {
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: rotation,
              fontSize: Math.max(8, el.fontSize * scaleY),
              width: node.width() * scaleX,
            };
          } else if (el.type === 'rect') {
            return {
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: rotation,
              width: Math.max(5, el.width * scaleX),
              height: Math.max(5, el.height * scaleY),
            };
          } else if (el.type === 'circle') {
            return {
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: rotation,
              radius: Math.max(5, el.radius * Math.max(scaleX, scaleY)),
            };
          } else if (el.type === 'ellipse') {
            return {
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: rotation,
              radiusX: Math.max(5, el.radiusX * scaleX),
              radiusY: Math.max(5, el.radiusY * scaleY),
            };
          } else if (el.type === 'star') {
            return {
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: rotation,
              innerRadius: Math.max(5, el.innerRadius * Math.max(scaleX, scaleY)),
              outerRadius: Math.max(10, el.outerRadius * Math.max(scaleX, scaleY)),
            };
          } else if (el.type === 'image') {
            return {
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: rotation,
              width: Math.max(10, el.width * scaleX),
              height: Math.max(10, el.height * scaleY),
            };
          } else {
            // For triangles, pentagons, hexagons, etc.
            return {
              ...el,
              x: node.x(),
              y: node.y(),
              rotation: rotation,
              radius: el.radius ? Math.max(5, el.radius * Math.max(scaleX, scaleY)) : el.radius,
              scaleX: el.scaleX !== undefined ? el.scaleX * scaleX : 1,
              scaleY: el.scaleY !== undefined ? el.scaleY * scaleY : 1,
            };
          }
        }
        return el;
      });
      
      setElements(updated);
      saveToHistory(updated);
      setIsDraft(true);
    };

    const commonProps = {
      key: element.id,
      id: element.id,
      draggable: true,
      onClick: () => setSelectedId(element.id),
      onDragEnd: updatePosition,
      onTransformEnd: handleTransformEnd,
    };

    switch (element.type) {
      case 'text':
        if (isEditing && editingId === element.id) {
          return null; // Hide the text when editing
        }
        return (
          <Text
            {...commonProps}
            {...element}
            fontFamily={element.fontFamily || 'Arial'}
            fontSize={element.fontSize || 20}
            fontWeight={element.fontWeight || 'normal'}
            fontStyle={element.fontStyle || 'normal'}
            textDecoration={element.textDecoration || ''}
            align={element.align || 'left'}
            width={element.width}
            onClick={(e) => {
              e.cancelBubble = true;
              setSelectedId(element.id);
            }}
            onDblClick={(e) => {
              e.cancelBubble = true;
              handleTextDoubleClick(element);
            }}
            onDragEnd={(e) => {
              const updated = elements.map((el) =>
                el.id === element.id ? { ...el, x: e.target.x(), y: e.target.y() } : el
              );
              setElements(updated);
              saveToHistory(updated);
            }}
          />
        );
      
      case 'rect':
        return <Rect {...commonProps} {...element} />;
      
      case 'circle':
        return <Circle {...commonProps} {...element} />;
      
      case 'ellipse':
        return <Ellipse {...commonProps} {...element} />;
      
      case 'triangle':
      case 'pentagon':
      case 'hexagon':
        return <RegularPolygon {...commonProps} {...element} />;
      
      case 'star':
        return <Star {...commonProps} {...element} />;
      
      case 'line':
        return (
          <Line
            {...commonProps}
            points={element.points}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            opacity={element.opacity}
          />
        );
      
      case 'arrow':
        return (
          <Arrow
            {...commonProps}
            points={element.points}
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            pointerLength={element.pointerLength}
            pointerWidth={element.pointerWidth}
            opacity={element.opacity}
          />
        );
      
      case 'image':
        return <ImageNode element={element} commonProps={commonProps} />;
      
      case 'heart':
        // Custom heart shape using path
        return (
          <RegularPolygon
            {...commonProps}
            sides={4}
            radius={element.width / 2}
            fill={element.fill}
            opacity={element.opacity}
            rotation={element.rotation + 45}
            scaleX={element.scaleX}
            scaleY={element.scaleY}
          />
        );
      
      default:
        return null;
    }
  };

  // Handle wheel event for zooming
  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    if (!pointer) return;
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale
    };
    
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setZoom(newScale);
    
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    };
    
    setPanX(newPos.x);
    setPanY(newPos.y);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.1, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.1, 0.1));
  const handleZoomReset = () => setZoom(1);
  const handleZoomFit = () => {
    const container = stageRef.current?.container();
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    const scale = Math.min(bounds.width / stageSize.width, bounds.height / stageSize.height);
    setZoom(scale);
    setPanY((bounds.height - stageSize.height * scale) / 2);
  };

  // Force re-render when elements change to ensure Konva elements update visually
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.getLayers().forEach(layer => {
        layer.batchDraw();
      });
    }
  }, [elements, selectedColor, strokeColor, strokeWidth]);

  // React to toolbar export requests
  useEffect(() => {
    if (!exportRequest) return;
    if (exportRequest === 'png') {
      handleExportPNG();
    } else if (exportRequest === 'pdf') {
      handleExportPDF();
    }
    // Clear the request
    dispatch(setExportRequest(null));
  }, [exportRequest]);

  // Listen to toolbar save event
  useEffect(() => {
    const onSave = (e) => {
      // default to complete save
      handleSaveComplete();
    };
    window.addEventListener('editor:save', onSave);
    return () => window.removeEventListener('editor:save', onSave);
  }, []);

  // Autosave (draft) on changes
  useEffect(() => {
    if (!preferences?.autoSave) return;
    if (!elements || elements.length === 0) return;
    const delay = preferences.autoSaveInterval || 30000;
    const t = setTimeout(async () => {
      try {
        const jsonData = { elements };
        if (currentDesign && currentDesign._id) {
          await dispatch(
            updateDesign({
              designId: currentDesign._id,
              designData: { jsonData, isDraft: true, canvasWidth: stageSize.width, canvasHeight: stageSize.height },
            })
          ).unwrap();
        } else {
          await dispatch(
            saveDesign({
              title: 'Untitled',
              jsonData,
              isDraft: true,
              canvasWidth: stageSize.width,
              canvasHeight: stageSize.height,
            })
          ).unwrap();
        }
      } catch (e) {
        // silent autosave failure
      }
    }, delay);
    return () => clearTimeout(t);
  }, [elements, preferences, dispatch, currentDesign, stageSize]);

  // Handle stage click event
  const handleStageClick = (e) => {
    // If clicking on the stage (not on an object), deselect any selected object
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  // Working text editing functions from your provided code
  const handleTextDoubleClick = (element) => {
    setEditingId(element.id);
    setEditText(element.text);
    setEditPosition({ x: element.x, y: element.y });
    setEditingElement(element);
    setIsEditing(true);
  };

  const updateText = () => {
    if (editingId && editText.trim() !== '') {
      const updated = elements.map((el) =>
        el.id === editingId ? { ...el, text: editText } : el
      );
      setElements(updated);
      saveToHistory(updated);
    }
    setIsEditing(false);
    setEditingId(null);
    setEditingElement(null);
    setEditText('');
  };

  // Live-update text while typing in overlay
  const handleTextChange = (e) => {
    const value = e.target.value;
    setEditText(value);
    if (!editingId) return;
    const updated = elements.map((el) =>
      el.id === editingId
        ? {
            ...el,
            text: value,
            // Keep font-related styles in sync while editing
            fontFamily: editingElement?.fontFamily || selectedFontFamily,
            fontSize: editingElement?.fontSize || selectedFontSize,
            fontWeight: editingElement?.fontWeight || (isBold ? 'bold' : 'normal'),
            fontStyle: editingElement?.fontStyle || (isItalic ? 'italic' : 'normal'),
            textDecoration: editingElement?.textDecoration || (isUnderline ? 'underline' : ''),
            align: editingElement?.align || textAlign,
            fill: editingElement?.fill || selectedColor,
          }
        : el
    );
    setElements(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      // Commit and exit on Escape
      updateText();
    }
  };

  // Text editor is directly in JSX below - no separate function needed
  
  // Centralized color handlers
  const handleFillColorChange = (value) => {
    setSelectedColor(value);
    if (!selectedId) return;
    
    const updated = elements.map((el) => {
      if (el.id !== selectedId) return el;
      if (el.type === 'text') return { ...el, fill: value };
      if (el.type === 'arrow' || el.type === 'line') {
        return { ...el, stroke: value, strokeColor: value, fill: value };
      }
      return { ...el, fill: value };
    });
    
    setElements(updated);
    saveToHistory(updated);
    setIsDraft(true);
    
    if (isEditing && editingId === selectedId) {
      setEditingElement((prev) => (prev ? { ...prev, fill: value, stroke: value, strokeColor: value } : prev));
    }
  };

  const handleStrokeColorChange = (value) => {
    setStrokeColor(value);
    if (!selectedId) return;
    
    const updated = elements.map((el) =>
      el.id === selectedId ? { ...el, stroke: value, strokeColor: value } : el
    );
    
    setElements(updated);
    saveToHistory(updated);
    setIsDraft(true);
  };

  // ToolPalette component
  const ToolPalette = () => {
    const [openShapes, setOpenShapes] = useState(false);
    
    return (
      <div className="bg-white border-b border-gray-200 p-2 flex items-center gap-2 relative sticky top-0 z-20">
        <button
          className={`p-2 rounded border ${activeTool === 'select' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700 hover:bg-gray-100 border-gray-300'}`}
          onClick={() => setActiveTool('select')}
          title="Select"
        >
          <FaMousePointer />
        </button>
        <button
          className={`p-2 rounded border ${activeTool === 'pan' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700 hover:bg-gray-100 border-gray-300'}`}
          onClick={() => setActiveTool('pan')}
          title="Pan"
        >
          <FaHandPaper />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button className="p-2 rounded border text-gray-700 hover:bg-gray-100 border-gray-300" onClick={handleAddText} title="Add text">
          <FaFont />
        </button>

        <div className="relative">
          <button
            className={`p-2 rounded border text-gray-700 hover:bg-gray-100 border-gray-300 ${openShapes ? 'ring-2 ring-blue-200' : ''}`}
            onClick={() => setOpenShapes((v) => !v)}
            title="Shapes"
          >
            <FaShapes />
          </button>
          {openShapes && (
            <div className="absolute z-50 mt-2 bg-white rounded shadow border border-gray-200 p-2 grid grid-cols-5 gap-2 w-80">
              <button className="p-2 hover:bg-gray-100 rounded" title="Rectangle" onClick={() => { handleAddRectangle(); setOpenShapes(false); }}>
                <FaSquare />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Circle" onClick={() => { handleAddCircle(); setOpenShapes(false); }}>
                <FaCircle />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Triangle" onClick={() => { handleAddTriangle(); setOpenShapes(false); }}>
                <FaCaretUp />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Star" onClick={() => { handleAddStar(); setOpenShapes(false); }}>
                <FaStar />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Line" onClick={() => { handleAddLine(); setOpenShapes(false); }}>
                <FaMinus />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Arrow" onClick={() => { handleAddArrow(); setOpenShapes(false); }}>
                <FaArrowRight />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Heart" onClick={() => { handleAddHeart(); setOpenShapes(false); }}>
                <FaHeart />
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button className="px-3 py-2 rounded border text-gray-700 hover:bg-gray-100 border-gray-300 disabled:opacity-50" onClick={handleImageUpload} disabled={isUploading} title="Upload image">
          <FaImage className="inline" />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button className="p-2 rounded border text-gray-700 hover:bg-gray-100 border-gray-300 disabled:opacity-50" onClick={handleUndo} disabled={historyStep <= 0} title="Undo">
          <FaUndo />
        </button>
        <button className="p-2 rounded border text-gray-700 hover:bg-gray-100 border-gray-300 disabled:opacity-50" onClick={handleRedo} disabled={historyStep >= history.length - 1} title="Redo">
          <FaRedo />
        </button>
        <button className="p-2 rounded border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50" onClick={handleDelete} disabled={!selectedId} title="Delete">
          <FaTrash />
        </button>

        {/* Text styling controls */}
        <div className="w-px h-6 bg-gray-600 mx-1" />
        <div className="flex items-center gap-1">
          <select
            className="px-2 py-1 bg-white text-gray-900 border border-gray-300 rounded"
            value={selectedFontFamily}
            onChange={(e) => {
              setSelectedFontFamily(e.target.value);
              if (selectedId) {
                const updated = elements.map((el) => el.id === selectedId ? { ...el, fontFamily: e.target.value } : el);
                setElements(updated);
                saveToHistory(updated);
                setIsDraft(true);
              }
            }}
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
          <input
            className="w-16 px-2 py-1 bg-white text-gray-900 border border-gray-300 rounded"
            type="number"
            min={8}
            max={200}
            value={selectedFontSize}
            onChange={(e) => {
              const size = parseInt(e.target.value || '0', 10);
              setSelectedFontSize(size);
              if (selectedId) {
                const updated = elements.map((el) => el.id === selectedId ? { ...el, fontSize: size } : el);
                setElements(updated);
                saveToHistory(updated);
                setIsDraft(true);
              }
            }}
          />
          <button
            className={`p-2 rounded border ${isBold ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700 hover:bg-gray-100 border-gray-300'}`}
            onClick={() => {
              const newBold = !isBold;
              setIsBold(newBold);
              if (selectedId) {
                const selectedElement = elements.find(el => el.id === selectedId);
                if (selectedElement?.type === 'text') {
                  const updated = elements.map((el) => el.id === selectedId ? { ...el, fontWeight: newBold ? 'bold' : 'normal' } : el);
                  setElements(updated);
                  saveToHistory(updated);
                  setIsDraft(true);
                }
              }
            }}
            title="Bold"
          >
            <FaBold />
          </button>
          <button
            className={`p-2 rounded border ${isItalic ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-700 hover:bg-gray-100 border-gray-300'}`}
            onClick={() => {
              const newItalic = !isItalic;
              setIsItalic(newItalic);
              if (selectedId) {
                const selectedElement = elements.find(el => el.id === selectedId);
                if (selectedElement?.type === 'text') {
                  const updated = elements.map((el) => el.id === selectedId ? { ...el, fontStyle: newItalic ? 'italic' : 'normal' } : el);
                  setElements(updated);
                  saveToHistory(updated);
                  setIsDraft(true);
                }
              }
            }}
            title="Italic"
          >
            <FaItalic />
          </button>
          
          <input
            type="color"
            className="w-8 h-8 rounded"
            value={selectedColor}
            onChange={(e) => handleFillColorChange(e.target.value)}
            title="Fill Color"
          />
          <input
            type="color"
            className="w-8 h-8 rounded"
            value={strokeColor}
            onChange={(e) => handleStrokeColorChange(e.target.value)}
            title="Stroke Color"
          />
          <input
            type="number"
            className="w-16 px-2 py-1 bg-white text-gray-900 border border-gray-300 rounded"
            min={0}
            max={20}
            value={strokeWidth}
            onChange={(e) => {
              const w = parseInt(e.target.value || '0', 10);
              setStrokeWidth(w);
              if (selectedId) {
                const updated = elements.map((el) => el.id === selectedId ? { ...el, strokeWidth: w } : el);
                setElements(updated);
                saveToHistory(updated);
                setIsDraft(true);
              }
            }}
            title="Stroke Width"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-white border border-gray-300 rounded shadow-sm">
            <button className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded-l" onClick={handleZoomOut} title="Zoom out">-</button>
            <div className="px-2 py-1 text-gray-600 text-xs min-w-[56px] text-center">{Math.round(zoom * 100)}%</div>
            <button className="px-2 py-1 text-gray-700 hover:bg-gray-100" onClick={handleZoomIn} title="Zoom in">+</button>
            <button className="px-2 py-1 text-gray-700 hover:bg-gray-100" onClick={handleZoomReset} title="Reset zoom">100%</button>
            <button className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded-r" onClick={handleZoomFit} title="Fit to screen">Fit</button>
          </div>

          {/* Save menu (green button) */}
          <div className="relative dropdown-container">
            <button className="px-3 py-2 bg-emerald-600 text-white rounded" onClick={() => { setShowSaveMenu((v) => !v); setShowExportMenu(false); }} title="Save options">
              <FaSave className="inline" />
            </button>
            {showSaveMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow border border-gray-200 py-1 z-50">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100" onClick={() => { setShowSaveMenu(false); handleSaveDraft(); }}>Save as Draft</button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100" onClick={() => { setShowSaveMenu(false); handleSaveComplete(); }}>Save & Close</button>
              </div>
            )}
          </div>

          {/* Export menu (blue button) */}
          <div className="relative dropdown-container">
            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => { setShowExportMenu((v) => !v); setShowSaveMenu(false); }} title="Export">
              <FaDownload className="inline" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow border border-gray-200 py-1 z-50">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100" onClick={() => { setShowExportMenu(false); handleExportPNG(); }}>Export as PNG</button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100" onClick={() => { setShowExportMenu(false); handleExportJPG(); }}>Export as JPG</button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100" onClick={() => { setShowExportMenu(false); handleExportPDF(); }}>Export as PDF</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // GridLayer component
  const GridLayer = ({ width, height, gridSize }) => {
    const grid = [];
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      grid.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, height]}
          stroke="#e0e0e0"
          strokeWidth={1}
        />
      );
    }
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      grid.push(
        <Line
          key={`h${y}`}
          points={[0, y, width, y]}
          stroke="#e0e0e0"
          strokeWidth={1}
        />
      );
    }
    return <Layer>{grid}</Layer>;
  };

  // Handle file drop for quick image add
  const handleFileDrop = async (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (!dt || !dt.files || dt.files.length === 0) return;
    const file = dt.files[0];
    if (!file.type.startsWith('image/')) return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const response = await uploadAPI.uploadImage(formData);
      const imageUrl = response.data.imageUrl || response.data.secureUrl || response.data.secure_url || response.data.url;
      const tempImg = new window.Image();
      tempImg.crossOrigin = 'anonymous';
      tempImg.src = imageUrl;
      tempImg.onload = () => {
        const maxDim = 300;
        const scale = Math.min(maxDim / tempImg.width, maxDim / tempImg.height, 1);
        const newImage = {
          id: Date.now().toString(),
          type: 'image',
          x: 100,
          y: 100,
          src: imageUrl,
          width: Math.round(tempImg.width * scale),
          height: Math.round(tempImg.height * scale),
          opacity: 1,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        };
        const newElements = [...elements, newImage];
        setElements(newElements);
        saveToHistory(newElements);
        setIsUploading(false);
      };
      tempImg.onerror = () => setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
    }
  };

  // Chatbot state and functions
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm your design assistant. I can help you with creative suggestions for your designs, color combinations, layout ideas, and more!",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Design suggestions for chatbot
  const designSuggestions = {
    colors: [
      "Try using a monochromatic color scheme with different shades of blue for a calming effect",
      "Consider complementary colors like orange and blue for high contrast and visual appeal",
      "Use an analogous color scheme (colors next to each other on the color wheel) for harmony",
      "Try a triadic color scheme - three colors equally spaced on the color wheel for vibrancy"
    ],
    layouts: [
      "Use the rule of thirds to create balanced and visually appealing compositions",
      "Consider the golden ratio (1.618:1) for naturally pleasing proportions",
      "Try asymmetrical layouts for dynamic and modern designs",
      "Use whitespace strategically to guide the viewer's attention"
    ],
    typography: [
      "Pair a serif font for headings with a sans-serif for body text for good readability",
      "Use font sizes that follow a clear hierarchy - headings should be significantly larger",
      "Consider line height (1.4-1.6) for optimal reading experience",
      "Limit your design to 2-3 font families to maintain consistency"
    ],
    general: [
      "Focus on the user's journey and create a clear visual hierarchy",
      "Use consistent spacing and alignment throughout your design",
      "Consider accessibility - ensure good contrast ratios for text",
      "Test your design on different screen sizes for responsive behavior"
    ]
  };

  const getRandomSuggestion = (category) => {
    const suggestions = designSuggestions[category] || designSuggestions.general;
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const generateChatResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    if (message.includes('color') || message.includes('colour')) {
      return {
        text: getRandomSuggestion('colors'),
        suggestions: ['Color Harmony', 'Contrast Tips', 'Brand Colors']
      };
    }

    if (message.includes('layout') || message.includes('arrangement') || message.includes('structure')) {
      return {
        text: getRandomSuggestion('layouts'),
        suggestions: ['Grid Systems', 'Visual Hierarchy', 'Responsive Design']
      };
    }

    if (message.includes('font') || message.includes('text') || message.includes('typography')) {
      return {
        text: getRandomSuggestion('typography'),
        suggestions: ['Font Pairing', 'Readability', 'Font Sizes']
      };
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        text: "Hello! I'm excited to help you with your design project. What specific area would you like suggestions for?",
        suggestions: ['Color Schemes', 'Layout Ideas', 'Typography', 'General Design Tips']
      };
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return {
        text: "You're very welcome! I'm here whenever you need more design inspiration. Feel free to ask about anything!",
        suggestions: ['More Suggestions', 'Specific Elements', 'Design Principles']
      };
    }

    const responses = [
      "That's an interesting design challenge! Here are some thoughts to consider...",
      "Great question! Let me share some design principles that might help...",
      "I love exploring creative solutions! Here's what I recommend...",
      "That's a common design consideration. Here's my perspective..."
    ];

    return {
      text: responses[Math.floor(Math.random() * responses.length)] + " " + getRandomSuggestion('general'),
      suggestions: ['Color Theory', 'Layout Principles', 'Typography Basics', 'Design Trends']
    };
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatTyping(true);

    setTimeout(() => {
      const response = generateChatResponse(chatInput);
      const botMessage = {
        id: chatMessages.length + 2,
        type: 'bot',
        text: response.text,
        suggestions: response.suggestions,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsChatTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleChatSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
  };

  const formatChatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle clicking outside the text editor
  const handleRootClick = (e) => {
    // Only blur if we're clicking outside the text editor
    const textEditor = e.target.closest('.text-editor-container');
    if (isEditing && !textEditor) {
      updateText();
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col bg-white editor-root" 
      onClick={handleRootClick}
    >
      <ToolPalette />
      
      {/* Canvas container */}
      <div className="flex-1 flex items-center justify-center p-4" onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
        <div className="canvas-container shadow-2xl ring-1 ring-black/10 rounded-lg border border-gray-300 bg-white">
          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            scaleX={zoom}
            scaleY={zoom}
            x={panX}
            y={panY}
            onWheel={handleWheel}
            onClick={handleStageClick}
            draggable={activeTool === 'pan'}
          >
            {/* Main layer */}
            <Layer>
              {elements.map((element) => (
                <React.Fragment key={element.id}>
                  {renderElement(element)}
                </React.Fragment>
              ))}
              <Transformer ref={transformerRef} />
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Chatbot Interface */}
      <div className="fixed bottom-10 right-10 z-40">
        {/* Chatbot Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300`}
          style={{
            backgroundColor: isChatOpen ? '#1A3D63' : '#4A7FA7',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isChatOpen ? '#0A1931' : '#B3CFE5';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = isChatOpen ? '#1A3D63' : '#4A7FA7';
          }}
          title={isChatOpen ? 'Close Design Assistant' : 'Open Design Assistant'}
        >
          <img
            src="/images/logo-m.png"
            alt="Design Assistant"
            className="w-8 h-8 mx-auto rounded object-contain"
          />
        </button>

        {/* Chat Window */}
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            {/* Chat Header */}
            <div className="p-3" style={{ background: `linear-gradient(to right, #4A7FA7, #1A3D63)`, color: 'white' }}>
              <div className="flex items-center gap-2">
                <img src="/images/logo-m.png" alt="AI Assistant" className="w-6 h-6 rounded" />
                <div>
                  <h3 className="font-semibold text-sm">Design Assistant</h3>
                  <p className="text-xs opacity-90">AI-powered design suggestions</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm`}
                    style={{
                      backgroundColor: message.type === 'user' ? '#1A3D63' : '#B3CFE5',
                      color: message.type === 'user' ? 'white' : '#0A1931'
                    }}
                  >
                    <p>{message.text}</p>
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleChatSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs rounded px-2 py-1 transition-colors"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              color: '#1A3D63'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                          >
                            ⭐ {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className={`text-xs mt-1`}
                      style={{
                        color: message.type === 'user' ? '#B3CFE5' : '#4A7FA7'
                      }}
                    >
                      {formatChatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isChatTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-3 py-2 rounded-lg max-w-xs">
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder="Ask for design suggestions..."
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none"
                  style={{
                    backgroundColor: '#0A1931',
                    borderColor: '#B3CFE5',
                    color: 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4A7FA7';
                    e.target.style.boxShadow = `0 0 0 2px #B3CFE5`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#B3CFE5';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim()}
                  className="px-3 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: chatInput.trim() ? '#1A3D63' : '#B3CFE5',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (chatInput.trim()) {
                      e.target.style.backgroundColor = '#0A1931';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (chatInput.trim()) {
                      e.target.style.backgroundColor = '#1A3D63';
                    }
                  }}
                >
                  Send
                </button>
              </div>

              {/* Quick Suggestions */}
              <div className="mt-2 flex flex-wrap gap-1">
                {['Colors', 'Layout', 'Typography', 'Tips'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleChatSuggestionClick(suggestion.toLowerCase())}
                    className="px-2 py-1 text-xs rounded transition-colors"
                    style={{
                      backgroundColor: '#B3CFE5',
                      color: '#1A3D63',
                      border: `1px solid #4A7FA7`
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#4A7FA7';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#B3CFE5';
                      e.target.style.color = '#1A3D63';
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {isEditing && (
        <textarea
          value={editText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onBlur={updateText}
          style={{
            position: 'absolute',
            top: editPosition.y + 64, // adjust for header
            left: editPosition.x,
            fontSize: editingElement?.fontSize || selectedFontSize,
            fontFamily: editingElement?.fontFamily || selectedFontFamily || 'Arial',
            fontWeight: editingElement?.fontWeight || (isBold ? 'bold' : 'normal'),
            fontStyle: editingElement?.fontStyle || (isItalic ? 'italic' : 'normal'),
            color: editingElement?.fill || selectedColor,
            background: 'rgba(31, 41, 55, 0.8)', // dark background
            border: '1px solid rgba(6, 182, 212, 0.5)', // cyan border
            outline: 'none',
            resize: 'none',
            width: editingElement?.width || 200,
            height: editingElement?.height || 50,
            lineHeight: 1,
            borderRadius: '4px',
            padding: '2px',
            zIndex: 1000,
          }}
          autoFocus
        />
      )}
      {/* Status bar */}
      <div className="h-8 bg-gray-900 text-gray-200 text-xs px-3 flex items-center gap-4 border-t border-gray-800">
        <div>Zoom: {Math.round(zoom * 100)}%</div>
        {selectedId ? (
          (() => {
            const sel = elements.find((el) => el.id === selectedId);
            if (!sel) return null;
            const w = sel.width || (sel.radius ? sel.radius * 2 : sel.outerRadius ? sel.outerRadius * 2 : undefined) || 0;
            const h = sel.height || (sel.radius ? sel.radius * 2 : sel.outerRadius ? sel.outerRadius * 2 : undefined) || 0;
            return (
              <div className="truncate">Selected: {sel.type} | x: {Math.round(sel.x || 0)} y: {Math.round(sel.y || 0)} w: {Math.round(w)} h: {Math.round(h)} rot: {Math.round(sel.rotation || 0)}</div>
            );
          })()
        ) : (
          <div className="text-gray-400">No selection</div>
        )}
        <div className="ml-auto text-gray-400" />
      </div>
    </div>
  );
};

export default CanvasEditor;