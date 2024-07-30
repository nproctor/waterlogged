
import {useState, useEffect} from 'react';
import { WaterData } from '@/app/types/types';
import { LatLngBounds } from 'leaflet';
import {useMap} from 'react-leaflet';
import { getEnvelopeInstantaneousValues } from '@/app/api/actions';
import toast from 'react-hot-toast';

const useSearchArea = () => {
    const [gaugeData, setGaugeData] = useState<WaterData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getArea = (bounds: LatLngBounds) => {
      const height = bounds.getNorth() - bounds.getSouth();
      const width = bounds.getEast() - bounds.getWest();
      return (height * width);
    }
  
    const getGaugeData = (bounds: LatLngBounds) => {
      // Check if already searching
      if (isLoading)
        return;

      // Check if bounds are within query limits
      if (getArea(bounds) > 25){
        toast.error("Zoom in to search this area!");
        return;
      }

      // Load data
      setIsLoading(true);
      const bBox = [bounds.getWest().toFixed(7), 
                    bounds.getSouth().toFixed(7), 
                    bounds.getEast().toFixed(7), 
                    bounds.getNorth().toFixed(7)];
      
      const promise = new Promise<void>((resolve, reject) => {
        getEnvelopeInstantaneousValues(bBox)
        .then((res) => {
          setGaugeData(res);
          resolve();
        })
        .catch(() => reject())
        .finally(() => setIsLoading(false))
      });
  
      toast.promise(promise, {
        loading: "Loading...",
        success: "Done!",
        error: "Error: Unable to load data",
      });
    }

    return {gaugeData, getGaugeData};
}

export default useSearchArea;