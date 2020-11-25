const {useEffect, useState} = require('react');

function useTimer(time, callback) {
  const [timer, setTimer] = useState(time);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(t => t - 1000);
      }

      if (timer <= 0) {
        callback();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [callback]);

  return timer;
}

export default useTimer;
