import React from "react";
const LeftSidebar = () => {
    return (
      <div className="h-full flex flex-col border-r">
        {/* Header */}
        <div className="py-2 px-3 bg-white flex flex-row justify-between items-center">
          <div>
            <img className="w-10 h-10 rounded-full" src="http://andressantibanez.com/res/avatar.png" alt="User Avatar" />
          </div>
          <div className="flex">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#727A7E" d="M12 20.664a9.163 9.163 0 0 1-6.521-2.702.977.977 0 0 1 1.381-1.381 7.269 7.269 0 0 0 10.024.244.977.977 0 0 1 1.313 1.445A9.192 9.192 0 0 1 12 20.664zm7.965-6.112a.977.977 0 0 1-.944-1.229 7.26 7.26 0 0 0-4.8-8.804.977.977 0 0 1 .594-1.86 9.212 9.212 0 0 1 6.092 11.169.976.976 0 0 1-.942.724zm-16.025-.39a.977.977 0 0 1-.953-.769 9.21 9.21 0 0 1 6.626-10.86.975.975 0 1 1 .52 1.882l-.015.004a7.259 7.259 0 0 0-5.223 8.558.978.978 0 0 1-.955 1.185z"></path></svg>
            </div>
            <div className="ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path opacity=".55" fill="#263238" d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"></path></svg>
            </div>
            <div className="ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#263238" fillOpacity=".6" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg>
            </div>
          </div>
        </div>
  
        {/* Search */}
        <div className="py-2 px-2 bg-white">
          <input type="text" className="w-full px-2 py-2 text-sm" placeholder="Search or start new chat" />
        </div>
  
        {/* Contacts */}
        <div className="bg-white flex-1 overflow-auto">
          <ContactItem
            image="https://darrenjameseeley.files.wordpress.com/2014/09/expendables3.jpeg"
            name="New Movie! Expendables 4"
            time="12:45 pm"
            message="Get Andrés on this movie ASAP!"
          />
          <ContactItem
            image="https://www.biography.com/.image/t_share/MTE5NDg0MDU1MTIyMTE4MTU5/arnold-schwarzenegger-9476355-1-402.jpg"
            name="Arnold Schwarzenegger"
            time="12:45 pm"
            message="I'll be back"
          />
          <ContactItem
            image="https://www.famousbirthdays.com/headshots/russell-crowe-6.jpg"
            name="Russell Crowe"
            time="12:45 pm"
            message="Hold the line!"
          />
          <ContactItem
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGpYTzuO0zLW7yadaq4jpOz2SbsX90okb24Z9GtEvK6Z9x2zS5"
            name="Tom Cruise"
            time="12:45 pm"
            message="Show me the money!"
          />
          <ContactItem
            image="https://www.biography.com/.image/t_share/MTE5NTU2MzE2MjE4MTY0NzQ3/harrison-ford-9298701-1-sized.jpg"
            name="Harrison Ford"
            time="12:45 pm"
            message="Tell Java I have the money"
          />
        </div>
      </div>
    );
  };
  
  const ContactItem = ({ image, name, time, message }) => {
    return (
      <div className="bg-white px-3 flex items-center hover:bg-grey-lighter cursor-pointer">
        <div>
          <img className="h-12 w-12 rounded-full" src={image} alt={name} />
        </div>
        <div className="ml-4 flex-1 border-b border-grey-lighter py-4">
          <div className="flex items-bottom justify-between">
            <p className="text-grey-darkest">{name}</p>
            <p className="text-xs text-grey-darkest">{time}</p>
          </div>
          <p className="text-grey-dark mt-1 text-sm">{message}</p>
        </div>
      </div>
    );
  };
  
  export default LeftSidebar;