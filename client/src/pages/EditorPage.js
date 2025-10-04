import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesign } from '../store/slices/designSlice';
import { loadDesign } from '../store/slices/canvasSlice';
import { setToolbarOpen } from '../store/slices/uiSlice';
import { clearCurrentDesign } from '../store/slices/designSlice';
import CanvasEditor from '../components/Canvas/CanvasEditor';

const EditorPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { currentDesign, loading } = useSelector((state) => state.design);

  // Debug logging
  console.log('=== EditorPage Debug Info ===');
  console.log('URL Parameters - id:', id);
  console.log('Current design state:', currentDesign);
  console.log('Loading state:', loading);
  console.log('Location state:', location?.state);
  console.log('Full location:', location);

  useEffect(() => {
    // Hide global toolbar while in editor
    dispatch(setToolbarOpen(false));
    return () => dispatch(setToolbarOpen(true));
  }, [dispatch]);

  useEffect(() => {
    if (id && id !== 'new' && id !== 'create') {
      dispatch(fetchDesign(id));
    } else if (id === 'create' || id === 'new' || !id) {
      // Clear any existing design data for new designs
      dispatch(clearCurrentDesign());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentDesign && id && id !== 'new' && id !== 'create') {
      dispatch(loadDesign({
        objects: currentDesign.jsonData?.objects || currentDesign.jsonData?.elements || [],
        canvasWidth: currentDesign.canvasWidth || 800,
        canvasHeight: currentDesign.canvasHeight || 600,
      }));
    } else if (!id || id === 'new' || id === 'create') {
      // Initialize blank canvas for new designs
      dispatch(loadDesign({
        objects: [],
        canvasWidth: 800,
        canvasHeight: 600,
      }));
    }
  }, [dispatch, currentDesign, id]);

  // Load from template passed via navigation state
  useEffect(() => {
    const tpl = location?.state?.template;
    if (tpl) {
      dispatch(loadDesign({
        objects: tpl.jsonData?.objects || tpl.jsonData?.elements || [],
        canvasWidth: tpl.canvasWidth || 800,
        canvasHeight: tpl.canvasHeight || 600,
      }));
    }
  }, [dispatch, location?.state]);


  if (loading && id && id !== 'new' && id !== 'create') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <CanvasEditor />;
};

export default EditorPage;
