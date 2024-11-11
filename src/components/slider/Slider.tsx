'use client'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './Slider.module.scss';

import sliderDatas from './SliderDatas';

import { AiOutlineArrowLeft } from 'react-icons/ai';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Image from 'next/image';

const Slider = () => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderLength = sliderDatas.length;

  const intervalTime = 5000;

  const prevSlide = useCallback(() => {
      setCurrentSlide(currentSlide === 0 ? sliderLength - 1 : currentSlide - 1);
  }, [currentSlide, sliderLength]);

  const nextSlide = useCallback(() => {
      setCurrentSlide(currentSlide === sliderLength - 1 ? 0 : currentSlide + 1);
  }, [currentSlide, sliderLength]);

  // 처음 로드시 slider가 0번으로 시작
  useEffect(() => {
    setCurrentSlide(0);
  }, []);  

  useEffect(() => {
    const interval = setInterval(nextSlide, intervalTime);
  
    return () => clearInterval(interval);
  }, [nextSlide]);
  
  return (
    <div className={styles.slider}>
      
      <AiOutlineArrowLeft className={`${styles.arrow} ${styles.prev}`} onClick={prevSlide} />
      <AiOutlineArrowRight className={`${styles.arrow} ${styles.next}`} onClick={nextSlide} />
      
      {sliderDatas.map((slider, index) => {
        // id we will not manipulate data, we use index otherwise id(manipulated data)
        const { image, heading, desc } = slider;
        return (
          <div
            key={index}
            className={index === currentSlide ? `${styles.slide} ${styles.current}` : `${styles.slide}`}
          >
            {index === currentSlide && (
              <>
                <Image src={image} alt='slide' fill />
              </>
            )}
          </div>
        )
      })}
    </div>
  )
};

export default Slider