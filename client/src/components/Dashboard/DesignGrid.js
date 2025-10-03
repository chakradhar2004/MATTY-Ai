import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesigns, deleteDesign, setCurrentDesign, updateDesign } from '../features/designSlice';
import { logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaPaintBrush, FaPalette, FaShapes, FaImage, FaMagic, FaStar, FaRobot, FaPlus, FaSignOutAlt, FaFileAlt, FaTrash, FaEye, FaEdit, FaCopy, FaShareAlt } from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { designs, loading, error } = useSelector((state) => state.design);
  const { token } = useSelector((state) => state.auth);

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [unit, setUnit] = useState('px');
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);



  useEffect(() => {
    if (token) {
      dispatch(fetchDesigns());
    } else {
      navigate('/login');
    }
  }, [dispatch, token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDelete = (id) => {
    dispatch(deleteDesign(id));
  };

  const handleEdit = (design) => {
    dispatch(setCurrentDesign(design));
    navigate('/editor');
  };

  const handleRename = (design) => {
    const newTitle = prompt('Enter new title:', design.title);
    if (newTitle && newTitle !== design.title) {
      dispatch(updateDesign({ id: design.id, title: newTitle, jsonData: design.jsonData }));
    }
  };

  const handleContextMenu = (e, design) => {
    e.preventDefault();
    setContextMenuPosition({x: e.clientX, y: e.clientY});
    setSelectedDesign(design);
    setShowContextMenu(true);
  };

  const handleHideMenu = () => {
    setShowContextMenu(false);
  };

  const handleDuplicate = () => {
    const dup = {...selectedDesign, title: selectedDesign.title + ' Copy', id: null};
    dispatch(setCurrentDesign(dup));
    navigate('/editor');
    setShowContextMenu(false);
  };

  const handleShare = () => {
    const link = window.location.origin + '/design/' + selectedDesign.id;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard');
    });
    setShowContextMenu(false);
  };

  const handleOk = () => {
    let width, height;
    switch (selectedRatio) {
      case '16:9':
        width = 1920;
        height = 1080;
        break;
      case '4:3':
        width = 1024;
        height = 768;
        break;
      case '1:1':
        width = 1000;
        height = 1000;
        break;
      case 'custom':
        width = parseInt(customWidth) || 800;
        height = parseInt(customHeight) || 600;
        break;
      default:
        width = 1920;
        height = 1080;
    }
    dispatch(setCurrentDesign(null));
    navigate('/editor', { state: { canvasWidth: width, canvasHeight: height } });
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative" onClick={handleHideMenu}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <FaPen className="absolute text-cyan-500 opacity-5" style={{top: '10%', left: '20%', fontSize: '3rem', transform: 'rotate(15deg)'}} />
        <FaPaintBrush className="absolute text-cyan-500 opacity-5" style={{top: '30%', right: '15%', fontSize: '2.5rem', transform: 'rotate(-10deg)'}} />
        <FaPalette className="absolute text-cyan-500 opacity-5" style={{bottom: '20%', left: '10%', fontSize: '2.8rem', transform: 'rotate(25deg)'}} />
        <FaShapes className="absolute text-cyan-500 opacity-5" style={{top: '50%', right: '25%', fontSize: '2rem', transform: 'rotate(45deg)'}} />
        <FaImage className="absolute text-cyan-500 opacity-5" style={{bottom: '40%', right: '10%', fontSize: '3.2rem', transform: 'rotate(-20deg)'}} />
        <FaMagic className="absolute text-cyan-500 opacity-5" style={{top: '20%', left: '50%', fontSize: '2.2rem', transform: 'rotate(30deg)'}} />
        <FaStar className="absolute text-cyan-500 opacity-5" style={{bottom: '10%', left: '60%', fontSize: '1.8rem', transform: 'rotate(-15deg)'}} />
        <FaRobot className="absolute text-cyan-500 opacity-5" style={{top: '70%', left: '30%', fontSize: '2.5rem', transform: 'rotate(60deg)'}} />
      </div>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-4 h-12 rounded-full shadow-2xl bg-gray-800/80 backdrop-blur-sm">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 h-full rounded-full transition-all duration-200 transform hover:scale-105"
          >
            New Design
          </button>
          <button
             onClick={handleLogout}
            className="text-white px-4 h-full rounded-full transition-all duration-200 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10 pt-20">
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
            <p className="text-gray-400 mt-4">Loading your designs...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-400 text-lg">Error loading designs: {error}</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-500/20 shadow-2xl">
            <FaPalette className="mx-auto h-20 w-20 text-cyan-400 mb-6" />
            <p className="text-gray-300 text-xl mb-6">No designs yet. Let's create your first masterpiece!</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 text-lg"
            >
              Create Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mx-auto max-w-5xl">
            {designs.map((design) => (
              <div key={design.id} className="bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-2xl rounded-2xl border border-gray-500/30 transition-all duration-300 transform hover:scale-105 cursor-pointer" onDoubleClick={() => handleEdit(design)} onContextMenu={(e) => handleContextMenu(e, design)}>
                {design.thumbnailUrl && (
                  <div className="w-full h-48 bg-white overflow-hidden">
                    <img src={design.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover scale-150" crossOrigin="anonymous" />
                  </div>
                )}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">{design.title}</h3>
                  <div className="text-sm text-cyan-300 mb-4">
                    <span className="bg-cyan-500/20 text-cyan-100 px-2 py-1 rounded-full text-xs font-medium mr-2">Draft</span>
                    <span>Last edited: {new Date(design.updatedAt || design.createdAt).toLocaleDateString()}</span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
        {showContextMenu && (
          <div
            className="fixed z-50 bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl p-1 animate-in fade-in duration-200"
            style={{left: contextMenuPosition.x, top: contextMenuPosition.y}}
          >
            <button onClick={() => { handleEdit(selectedDesign); setShowContextMenu(false); }} className="flex items-center w-full text-left px-4 py-3 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 rounded-lg transition-all duration-150">
              <FaEye className="mr-3 text-cyan-400" /> Open
            </button>
            <button onClick={() => { handleRename(selectedDesign); setShowContextMenu(false); }} className="flex items-center w-full text-left px-4 py-3 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 rounded-lg transition-all duration-150">
              <FaEdit className="mr-3 text-cyan-400" /> Rename
            </button>
            <button onClick={() => { handleDelete(selectedDesign.id); setShowContextMenu(false); }} className="flex items-center w-full text-left px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-100 rounded-lg transition-all duration-150">
              <FaTrash className="mr-3 text-red-400" /> Delete
            </button>
            <button onClick={handleDuplicate} className="flex items-center w-full text-left px-4 py-3 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 rounded-lg transition-all duration-150">
              <FaCopy className="mr-3 text-cyan-400" /> Duplicate
            </button>
            <button onClick={handleShare} className="flex items-center w-full text-left px-4 py-3 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-100 rounded-lg transition-all duration-150">
              <FaShareAlt className="mr-3 text-cyan-400" /> Share
            </button>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-white mb-4">Configure Canvas</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Aspect Ratio</label>
                  <select
                    value={selectedRatio}
                    onChange={(e) => setSelectedRatio(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="16:9">16:9 (1920x1080)</option>
                    <option value="4:3">4:3 (1024x768)</option>
                    <option value="1:1">1:1 (1000x1000)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {selectedRatio === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Width (px)</label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        min="100"
                        max="4000"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Height (px)</label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                        min="100"
                        max="4000"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-gray-300 mb-2">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="px">Pixels (px)</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOk}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
