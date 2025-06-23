import React from 'react';

const ProductPage = () => {
  return (
    <section className="font-['Poppins']  flex items-center justify-center bg-orange-350 bg-opacity-20 h-[100vh] pt-10 ">
      <div className="flex w-full h-full p-10 bg-orange-350 border-orange-350  rounded-xl">
        <div className="flex flex-col gap-14 items-center">
          {/* SVG and Images */}
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 8.5L8 1.5L1 8.5" stroke="#FFA500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <div className="flex flex-col gap-3">
            <img className="w-20 h-[90px]" src="https://iili.io/3HJzjs4.png" alt="" />
            <img className="w-20 h-[90px]" src="https://iili.io/3HJTOH7.png" alt="" />
            <img className="w-20 h-[90px]" src="https://iili.io/3HJTeR9.png" alt="" />
            <img className="w-20 h-[90px]" src="https://iili.io/3HJTkNe.png" alt="" />
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 8.5L12 15.5L5 8.5" stroke="#FFA500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
        <img className="w-[556px] ml-3 mr-6" src="https://iili.io/3HJzNql.png" alt="" />
        <div>
          <div className="flex gap-2 items-center">
            <h1 className="text-[36px] leading-[44px] font-semibold text-white">Chinese Cabbage</h1>
            <span className="text-sm text-white px-2 py-1 bg-lime-400 rounded">Availible</span>
          </div>
          <div className="flex items-center mt-3 text-sm leading-[1.5]">
            <span className="text-orange-500">4 Review . </span>
            <span className="font-medium text-orange-500">SKU:</span>
            <span className="text-gray-700">2,51,594</span>
          </div>
        
          <p className="w-[500px] text-justify text-gray-700 text-sm font-normal mt-4 leading-[21px]">
            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla nibh diam, blandit vel consequat nec, ultrices et ipsum. Nulla varius magna a consequat pulvinar.
          </p>
          <div className="h-[88px] mt-6 py-[18px] bg-orange-350 justify-center items-center gap-3 flex">
  <button className="h-[51px] px-20 py-4 bg-orange-500 text-white rounded-[43px] font-semibold">
    Add to Cart
  </button>

  {/* Call Button with Shake Animation */}
  <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-[43px] font-semibold animate-[shake_0.5s_infinite]">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.17C15.68 14.9 16.08 14.82 16.42 14.94C17.85 15.41 19.38 15.67 20.93 15.67C21.5 15.67 22 16.17 22 16.75V20.92C22 21.49 21.5 22 20.93 22C10.64 22 2 13.36 2 3.07C2 2.5 2.51 2 3.08 2H7.25C7.83 2 8.33 2.5 8.33 3.07C8.33 4.62 8.59 6.15 9.06 7.58C9.18 7.92 9.1 8.32 8.83 8.59L6.62 10.79Z" fill="white"/>
    </svg>
    Call
  </button>

  <a href='/Chat' className="px-6 py-3 bg-orange-500 text-white rounded-[43px] font-semibold">Messege</a>
</div>

          <div className="h-[54px] mt-6 flex-col justify-start items-start gap-3 inline-flex">
            <div className="justify-start items-start gap-1.5 inline-flex">
              <span className="text-orange-500 text-sm font-medium leading-[21px]">Category:</span>
              <span className="text-gray-700 text-sm font-normal leading-[21px]">Vegetables</span>
            </div>
            <div className="justify-start items-start gap-1.5 inline-flex">
              <span className="text-orange-500 text-sm font-medium leading-[21px]">Tag:</span>
              <span className="text-gray-700 text-sm font-normal leading-[21px]">Vegetables</span>
              <span className="text-gray-700 text-sm font-normal leading-[21px]">Healthy</span>
              <span className="text-orange-500 text-sm font-normal underline leading-[21px]">Chinese</span>
              <span className="text-gray-700 text-sm font-normal leading-[21px]">Cabbage</span>
              <span className="text-gray-700 text-sm font-normal leading-[21px]">Green Cabbage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;