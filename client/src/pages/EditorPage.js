import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesign } from '../store/slices/designSlice';
import { loadDesign } from '../store/slices/canvasSlice';
import { setToolbarOpen } from '../store/slices/uiSlice';
import CanvasEditor from '../components/Canvas/CanvasEditor';

const EditorPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { currentDesign, loading } = useSelector((state) => state.design);

  useEffect(() => {
    // Hide global toolbar while in editor
    dispatch(setToolbarOpen(false));
    return () => dispatch(setToolbarOpen(true));
  }, [dispatch]);

  useEffect(() => {
    if (id && id !== 'new') {
      dispatch(fetchDesign(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentDesign && id !== 'new') {
      dispatch(loadDesign({
        objects: currentDesign.jsonData?.objects || currentDesign.jsonData?.elements || [],
        canvasWidth: currentDesign.canvasWidth || 800,
        canvasHeight: currentDesign.canvasHeight || 600,
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


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <CanvasEditor />;
};

export default EditorPage;
