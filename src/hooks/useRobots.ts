import { useState, useEffect, useCallback } from 'react';
import { Robot, ApiResponse } from '../types/robot';
import apiService from '../services/api';

export const useRobots = (filters?: { type?: string; status?: string }) => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRobots = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Robot[]> = await apiService.getAllRobots(filters);

      if (response.success && response.data) {
        setRobots(response.data);
      } else {
        setError(response.message || 'Failed to fetch robots');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRobots();
  }, [fetchRobots]);

  const refreshRobots = useCallback(() => {
    fetchRobots();
  }, [fetchRobots]);

  return {
    robots,
    loading,
    error,
    refreshRobots,
  };
};

export const useRobot = (id: string | undefined) => {
  const [robot, setRobot] = useState<Robot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRobot = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Robot> = await apiService.getRobotById(id);

      if (response.success && response.data) {
        setRobot(response.data);
      } else {
        setError(response.message || 'Failed to fetch robot');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRobot();
  }, [fetchRobot]);

  const refreshRobot = useCallback(() => {
    fetchRobot();
  }, [fetchRobot]);

  return {
    robot,
    loading,
    error,
    refreshRobot,
  };
};