import { useEffect, useState } from "react";
import styles from "../styles/ProgressBar.module.css";

function ProgressLister() {
  let [data, setTestData] = useState([]);

  useEffect(() => {
    setTestData([
      {
        date: "2nd March",
        status: "done",
        task: "Read your book",
      },
      {
        date: "3rd March",
        status: "notdone",
        task: "Buy past questions",
      },
      {
        date: "4th March",
        status: "",
        task: "Stay alive",
      },
      {
        date: "5th March",
        status: "",
        task: "Eat alive",
      },
    ]);
  }, []);
  return (
    <div>
      <div className="flex items-center font-archivo h-full">
        <div className={"h-full"}>
          <div>
            {data.map((eachData, index) => {
              return (
                <div key={index} className="h-full pt-1 pb-1 flex items-center">
                  {eachData.date}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="h-full w-8 flex flex-col justify-center">
            {/* <div className={styles.li + ` ${styles.done}`}></div>
            <div className={styles.li + ` `}></div>
            <div className={styles.li}></div> */}
            {data.map((eachData, index) => {
              return (
                <div
                  key={index}
                  className={
                    styles.li +
                    ` ${
                      eachData.status == "done"
                        ? styles.done
                        : eachData.status == "notdone"
                        ? styles.notdone
                        : ""
                    }`
                  }
                ></div>
              );
            })}
          </div>
        </div>
        <div className="h-full">
          <div>
            {data.map((eachData, index) => {
              return (
                <div key={index} className="h-full pt-1 pb-1 flex items-center">
                  {eachData.task}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressLister;
