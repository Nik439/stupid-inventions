const {useEffect, useState} = require('react');

function useTimer(time, callback) {
  const [timer, setTimer] = useState(time);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t - 1000);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (timer < 0) {
      callback();
    }
  }, [timer, callback]);

  return timer;
}

export default useTimer;
