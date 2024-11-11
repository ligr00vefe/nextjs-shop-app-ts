import React from 'react';
import styles from './Loader.module.scss';
import { DNA } from 'react-loader-spinner';

interface ILoaderProps {
    basic?: boolean;
}

const Loader = ({ basic }: ILoaderProps) => {
    if (basic) {
        return (
            <div className={styles.basicWrapper}>
                {/* <RotatingLines
          strokeColor='grey'
          strokeWidth='5'
          animationDuration='0.75'
          width='30'
          visible={true}
        /> */}
                <DNA
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.loader}>
                {/* <RotatingLines
          strokeColor='grey'
          strokeWidth='5'
          animationDuration='0.75'
          width='30'
          visible={true}
        /> */}
                <DNA
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />
            </div>
        </div>
    );
};

export default Loader;
