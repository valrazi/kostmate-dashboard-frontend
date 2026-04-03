import { Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function Branch() {
  const navigate = useNavigate();
  const username = "Manto Ariyansyah";

  return (
    <div className="min-h-screen bg-gray-100">
      <div 
        className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2"
        style={{ top: '-24px' }}
      >
        {/* HEADER */}
        <Header title="Branch" username={username} />

        {/* SEARCH + BUTTON */}
        <div className="w-full md:w-1/2 max-w-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
          <Input
            placeholder="Cari Nama Branch"
            prefix={<SearchOutlined />}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/branch/add')}
            className="w-full sm:w-auto"
          >
            Branch
          </Button>
        </div>
      </div>

      {/* LIST BRANCH */}
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md h-32 flex flex-col p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate('/branch/room')}
          >
            {/* Nama */}
            <h2 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
              Kost Anugrah
            </h2>

            {/* Isi tengah */}
            <div className="flex-1 flex justify-center items-center">
              <span className="text-gray-500 font-medium text-center">
                <span className="text-black font-bold text-lg">
                  27
                </span>
                /80
              </span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Branch;