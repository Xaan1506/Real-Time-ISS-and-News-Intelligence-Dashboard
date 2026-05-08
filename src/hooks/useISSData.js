import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { fetchIssLocation, fetchPeopleInSpace, reverseGeocode } from '../services/issService';
import { calculateSpeedKmH } from '../utils/geo';
import { ISS_REFRESH_MS } from '../utils/constants';
import { useDashboardStore } from '../context/useDashboardStore';

export function useISSData() {
  const { autoRefresh, setISSData } = useDashboardStore();
  const hasShownIssError = useRef(false);
  const hasShownAstroError = useRef(false);

  const refreshISS = useCallback(async () => {
    try {
      setISSData({ isLoadingISS: true, issError: null });
      const location = await fetchIssLocation();
      if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude) || !location.timestamp) {
        throw new Error('Invalid ISS payload');
      }
      const previous = useDashboardStore.getState().issPositions.at(-1);
      const speed = calculateSpeedKmH(previous, location);
      const place = await reverseGeocode(location.latitude, location.longitude);
      const existing = useDashboardStore.getState().issPositions;
      const nextPositions = [...existing, location].slice(-15);
      const nextSpeedHistory = [...useDashboardStore.getState().speedHistory, { time: location.timestamp, speed }].slice(-30);

      setISSData({
        issPositions: nextPositions,
        currentSpeed: speed,
        nearestPlace: place,
        speedHistory: nextSpeedHistory,
        isLoadingISS: false,
        issError: null,
      });
      hasShownIssError.current = false;
    } catch {
      setISSData({ isLoadingISS: false, issError: 'Failed to refresh ISS location' });
      if (!hasShownIssError.current) {
        toast.error('Failed to refresh ISS location');
        hasShownIssError.current = true;
      }
    }
  }, [setISSData]);

  const refreshAstronauts = useCallback(async () => {
    try {
      const data = await fetchPeopleInSpace();
      setISSData({ peopleInSpace: data });
      hasShownAstroError.current = false;
    } catch {
      if (!hasShownAstroError.current) {
        toast.error('Failed to fetch astronauts data');
        hasShownAstroError.current = true;
      }
    }
  }, [setISSData]);

  useEffect(() => {
    refreshISS();
    refreshAstronauts();
  }, [refreshISS, refreshAstronauts]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const id = setInterval(refreshISS, ISS_REFRESH_MS);
    return () => clearInterval(id);
  }, [autoRefresh, refreshISS]);

  return { refreshISS, refreshAstronauts };
}
