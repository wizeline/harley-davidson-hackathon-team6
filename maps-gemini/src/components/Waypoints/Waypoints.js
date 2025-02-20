import { useState } from "react";

const Waypoints = (waypoints) => {
  console.log(waypoints)
  const [openIndex, setOpenIndex] = useState(null);


  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formattedWaypoints = waypoints.waypoints.map((waypoint, index) => {
    return <li key={index}>{waypoint.location.city}</li>
  });

  const sections = [
    { title: "WAYPOINTS", content: formattedWaypoints  },
  ];

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4 mb-4">
      {sections.map((section, index) => (
        <div key={index} className="border border-gray-500 rounded-lg overflow-hidden">
          <button
            className="w-full flex justify-between items-center p-3 font-semibold text-[#f60]"
            onClick={() => toggleSection(index)}
          >
            {section.title}
            <span>{openIndex === index ? "▲" : "▼"}</span>
          </button>
          {openIndex === index && (
            <div className="p-3 bg-gray-700 h-auto text-gray-300 ">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Waypoints;