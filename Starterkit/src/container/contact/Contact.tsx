import React, { useState, ChangeEvent, FC } from "react";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";

const UserReports: FC = () => {
  // State for the message
  const [message, setMessage] = useState("");

  // Function to handle changes in the textarea
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    // Limit the message length to 200 characters
    if (inputValue.length <= 200) {
      setMessage(inputValue);
    }
  };

  return (
    <FadeInWrapper>
      <div className="container mx-auto pt-20 pb-20">
        <div className="mb-10 p-6 border rounded-lg bg-white shadow">
          <h2 className="text-2xl font-bold text-gray-800">
            В тази страница имате възможността да направите обратна връзка!
          </h2>
          <hr className="my-4 border-gray-300" />
          <p className="text-gray-600">
            Ако намерите някакъв проблем в нашето приложение или имате
            препоръки, напишете ни и ние ще отговорим възможно най-бързо!
          </p>
        </div>

        <div className="p-6 border rounded-lg bg-white shadow">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@noit.eu..."
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Вашето име <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Моля напишете вашето име тук..."
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Вашето съобщение <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                placeholder="Моля напишете вашето съобщение тук..."
                value={message}
                onChange={handleInputChange}
                required
                maxLength={200}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">
                Максимална дължина: 200 символа.
              </p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            >
              Изпратете съобщение
            </button>
          </form>
        </div>
      </div>
    </FadeInWrapper>
  );
};

export default UserReports;
