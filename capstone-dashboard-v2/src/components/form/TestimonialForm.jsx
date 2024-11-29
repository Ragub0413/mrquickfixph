import React, { useState } from "react";
import { Title } from "../props/Title";
import { useParams } from "react-router-dom";
import Logo from "../../assets/Mr.QuickFixLogo.webp";
import Swal from "sweetalert2";
import { Button } from "@material-tailwind/react";
import { useTestimonialData } from "../../data/TestimonialData";

const TestimonialForm = () => {
  const [data,setData] = useState({
    feedbackMessage:""
  })
  //const [feedbackMessage, setTestimonialMessage] = useState("");
  const [loading,setLoading] = useState(false);
  const params = useParams();
const {createTestimonial} = useTestimonialData();
  const handleSubmitFeedback = async () => {
    if (!data.feedbackMessage) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill out the feedback form before submitting.",
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true)
    const id = params.id;
    const {success,message}= await createTestimonial(id,data);
    console.log(data.feedbackMessage)
    setLoading(false)
    if (!success) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
      }).then((result)=>{
        if (result.isConfirmed) {
          Swal.fire({
            title: "Thank you",
            text: "Do you want to visit our website?",
            showCancelButton: true,
            confirmButtonText: "OK",
            confirmButtonText: "Yes",
            icon: "question",
          }).then(async (finalResult) => {
            if(finalResult.isConfirmed){
             window.location.href = 'http://localhost:5174/'
            }
          });
        }
      })
    //  onClose();
    }
    // Swal.fire({
    //   icon: "success",
    //   title: "Success",
    //   text: "Thank you for your feedback! We appreciate it.",
    //   showConfirmButton: true,
    //   confirmButtonText: "OK",
    // }).then(() => {
    //  // window.location.href = "/"; // Redirect to the home page of website
    // });
  };

  return (
    <div className="my-16 flex items-center justify-center px-4">
      <div className="h-auto w-full max-w-[1200px] rounded-xl bg-white p-8 shadow-xl">
        <img
          src={Logo}
          alt="Logo"
          className="mx-auto mb-6 h-[40px] md:h-[50px]"
        />
        <div className="text-center">
          <Title variant="secondarySemibold" size="xl">
            We Value Your Feedback
          </Title>
        </div>
        <p className="mt-4 text-center text-sm text-secondary-600 md:text-base">
          Your thoughts help us improve. Please take a moment to share your
          experience with us. We’d love to hear how we did or how we can serve
          you better!
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <textarea
            value={data.feedbackMessage}
            onChange={(e) => setData({feedbackMessage: e.target.value})}
            placeholder="Write your feedback here..."
            className="h-[150px] w-full resize-none rounded-lg border border-gray-300 p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
          <div className="flex justify-end">
            <Button className="bg-primary-500" onClick={handleSubmitFeedback}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialForm;