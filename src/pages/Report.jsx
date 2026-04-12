import Header from '../components/Header';

function Report() {
  const username = "Manto Ariyansyah";

  return (
    <div className="min-h-screen bg-gray-100">

      <div 
        className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2"
        style={{ top: '0px' }}
      >
        {/* HEADER */}
        <Header title="Reports" username={username} />

      </div>

      
    </div>
  );
}

export default Report;