import React, { useState, ChangeEvent, FC } from "react";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";

const UserReports: FC = () => {
  // State for the form data
  const [formData, setFormData] = useState({
    email: "",
    name: ""
  });

  // State for the message
  const [message, setMessage] = useState("");

  // State for empty fields validation
  const [emptyFields, setEmptyFields] = useState({
    email: false,
    name: false,
    message: false
  });

  // Function to handle input changes
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 200) {
      setMessage(inputValue);
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const isEmpty = {
      email: !formData.email,
      name: !formData.name,
      message: !message
    };

    setEmptyFields(isEmpty);

    if (!Object.values(isEmpty).includes(true)) {
      console.log("Form submitted with:", {
        email: formData.email,
        name: formData.name,
        message
      });
      // Reset form if needed
      setFormData({ email: "", name: "" });
      setMessage("");
    }
  };

  return (
    <FadeInWrapper>
      <div className="container mx-auto pt-20 pb-20">
        {/* Main Section Card */}
        <div className="box mb-10 p-6 border-2 border-primary rounded-lg shadow">
          <h2 className="box-title" style={{ fontSize: "1.5rem" }}>
            В тази страница имате възможността да направите обратна връзка!
          </h2>
          <hr className="my-4 border-primary" />
          <p className="text-gray-600">
            Ако намерите някакъв проблем в нашето приложение или имате
            препоръки, напишете ни и ние ще отговорим възможно най-бързо!
          </p>
        </div>

        {/* Feedback Form Card */}
        <div className="box p-6 border-2 border-primary rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-12 gap-y-4">
              <div className="xl:col-span-12 col-span-12 mt-0">
                <label htmlFor="email" className="form-label text-default">
                  Email <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-control form-control-lg w-full !rounded-md ${
                    emptyFields.email ? "empty-field" : ""
                  }`}
                  placeholder="example@noit.eu..."
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="xl:col-span-12 col-span-12 mb-4">
                <label htmlFor="name" className="form-label text-default block">
                  Вашето име <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className={`form-control form-control-lg w-full !rounded-md ${
                    emptyFields.name ? "empty-field" : ""
                  }`}
                  placeholder="Моля напишете вашето име тук..."
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="xl:col-span-12 col-span-12">
                <label
                  htmlFor="message"
                  className="form-label text-default block"
                >
                  Вашето съобщение <span className="text-primary">*</span>
                </label>
                <textarea
                  className="form-control bg-opacity-70 border-2 rounded-lg p-4 mb-4 text-white hover:text-[#d94545] min-h-[2.5rem] max-h-[10rem]"
                  placeholder="Моля напишете вашето съобщение тук..."
                  value={message} // Controlled component value
                  onChange={handleMessageChange} // Use the specific handler for textarea
                  required
                  maxLength={200}
                  rows={4}
                />
                <div className="text-right mt-2">
                  <small>{`${message.length} / 200`}</small>
                </div>
              </div>

              <div className="xl:col-span-12 col-span-12 mt-2">
                <button
                  type="submit"
                  className="ti-btn ti-btn-lg bg-primary text-white !font-medium dark:border-defaultborder/10"
                >
                  Изпратете съобщение
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </FadeInWrapper>
  );
};

export default UserReports;
