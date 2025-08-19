import { memo, useState } from 'react';
import { useMovie } from '../../hook/useGatusers';

const Users = () => {

  const { getMovies, deleteUsers } = useMovie();
  const { data, isLoading } = getMovies;
  
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 continer">
      <div className="scrol-bar overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Full Name</th>
              <th className="px-4 py-3 border">Username</th>
              <th className="px-4 py-3 border">Age</th>
              <th className="px-4 py-3 border">Tel 1</th>
              <th className="px-4 py-3 border">Tel 2</th>
              <th className="px-4 py-3 border">Daraja</th>
              <th className="px-4 py-3 border">Ish holati</th>
              <th className="px-4 py-3 border">Universitet</th>
              <th className="px-4 py-3 border">Yo‘nalish</th>
              <th className="px-4 py-3 border">Till</th>
              <th className="px-4 py-3 border">Addres (doimiy)</th>
              <th className="px-4 py-3 border">Addres (hozirgi)</th>
              <th className="px-4 py-3 border">Portfolio</th>
              <th className="px-4 py-3 border">Rezume</th>
              <th className="px-4 py-3 border text-center">Amal</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {data?.users?.map((item, index) => (
              <tr
                key={item.id}
                className={`transition duration-200 hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border font-medium">
                  {item.fullName}
                </td>
                <td className="px-4 py-2 border">{item.username}</td>
                <td className="px-4 py-2 border">{item.age}</td>
                <td className="px-4 py-2 border">{item.tel_1}</td>
                <td className="px-4 py-2 border">{item.tel_2}</td>
                <td className="px-4 py-2 border">{item.daraja}</td>
                <td className="px-4 py-2 border">{item.ish_holati}</td>
                <td className="px-4 py-2 border">{item.universitet}</td>
                <td className="px-4 py-2 border min-w-[160px]">
                  {item.yonalish}
                </td>
                <td className="px-4 py-2 border min-w-[160px]">
                  {item.till?.join(', ')}
                </td>
                <td className="px-4 py-2 border">{item.addres_doyimiy}</td>
                <td className="px-4 py-2 border">{item.addres_hozir}</td>
                <td className="px-4 py-2 border text-blue-600 underline">
                  <a href={item.portfoly_link} target="_blank" rel="noreferrer">
                    Portfolio
                  </a>
                </td>
                <td className="px-4 py-2 border text-blue-600 underline">
                  <a href={item.rezumey_link} target="_blank" rel="noreferrer">
                    Rezume
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => deleteUsers.mutate(item.id)}
                    className="text-red-600 font-bold"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(Users);
