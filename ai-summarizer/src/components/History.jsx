import ReactMarkdown from "react-markdown";

const History = ({ history, handleDelete }) => {
  return (
    <section className="mt-8 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Riwayat Ringkasan</h2>
      {history.length === 0 ? (
        <p className="text-gray-700">Tidak ada riwayat ringkasan.</p>
      ) : (
        <ul className="list-disc list-inside text-gray-700 flex flex-col gap-2">
          {history.map((item, index) => (
            <li key={index} className="flex justify-between items-center gap-8">
              <div>
                <h1 className="text-black font-semibold">
                  Summary {index + 1}:
                </h1>
                <ReactMarkdown>{item}</ReactMarkdown>
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="ml-4 px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default History;
