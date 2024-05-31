import {Request,Response} from "express";
// landing page
export const landingPage = (req:Request, res:Response) => {
  res.render("landingPage", { title: "Garage Management System" });
};

// owner dashboard
export const dashboard = async (req:Request, res:Response) => {
  res.render("index", { title: "Home", active: "dashboard" });
};

// customer home page
export const home = async (req:Request, res:Response) => {
  res.render("customer", { title: "Home", active: "dashboard" });
};

// owner profile
export const userProfile = async (req:Request, res:Response) => {
  res.render("index", { title: "Profile", active: "profile" });
};

// owner garages listing
export const garageListing = (req:Request, res:Response) => {
  res.render("index", { title: "Garages", active: "garages" });
};

// owner services listing
export const services = (req:Request, res:Response) => {
  res.render("index", { title: "Services", active: "services" });
};

// owner slots listing
export const slots = (req:Request, res:Response) => {
  res.render("index", { title: "Slots", active: "slots" });
};

// owner appointments listing
export const appointments = (req:Request, res:Response) => {
  res.render("index", { title: "Appointments", active: "appointment" });
};

// owner inventory listing
export const inventory = (req:Request, res:Response) => {
  res.render("index", { title: "Inventory", active: "inventory" });
};

// owner tasks listing
export const tasks = (req:Request, res:Response) => {
  res.render("index", { title: "Tasks", active: "tasks" });
};

// owner employee listing
export const employee = (req:Request, res:Response) => {
  res.render("index", { title: "Employees", active: "employee" });
};

// owner invoice listing
export const invoice = (req:Request, res:Response) => {
  res.render("index", { title: "Invoice", active: "invoice" });
};

// 404 page for unknown routes
export const notFound = (req:Request, res:Response) => {
  res.render("404", { title: "404 Not Found!" });
};

// garage form display
export const garageForm = (req:Request, res:Response) => {
  let data = [{}];
  res.render("garage/garageModule", { title: "Garage Form", data });
};

// calendar display on owner side
export const calendar = (req:Request, res:Response) => {
  res.render("garage/calendar", { title: "Calendar" });
};

// session end alert message
export const sessionEnd = (req:Request, res:Response) => {
  res.render("sessionEnd");
};

// customer vehicle page
export const vehicles = async (req:Request, res:Response) => {
  res.render("customer", { active: "vehicle" });
};

// listing of customer vehicles
export const vehiclesList = async (req:Request, res:Response) => {
  res.render("customer", { active: "vehicleList" });
};

// services listing for customer
export const service = async (req:Request, res:Response) => {
  res.render("customer", { active: "service" });
};

// slots listing with calendar for customer
export const slot = async (req:Request, res:Response) => {
  res.render("customer", { active: "slots" });
};

// payment page for customer
export const payment = async (req:Request, res:Response) => {
  res.render("customer", { active: "payment" });
};

// add vehicle form for customer
export const addVehicles = async (req:Request, res:Response) => {
  res.render("customer", { active: "addVehicle" });
};

// customers profile page
export const profile = async (req:Request, res:Response) => {
  res.render("customer", { active: "profile" });
};

// customer appointments listing
export const appointment = async (req:Request, res:Response) => {
  res.render("customer", { active: "appointment" });
};

// customer vehicle listing
export const customerVehicleSelection = (req:Request, res:Response) => {
  res.render("customerVehicleSelection.ejs");
};

export const CustomerFeedback = async (req:Request, res:Response) => {
  res.render("customer/customerFeedback.ejs");
};

// garages listing
export const garageList = (req:Request, res:Response) => {
  res.render("garage/garageList.ejs");
};

// sign up page
export const signUp = (req:Request, res:Response) => {
  res.render("auth/signUp", { title: "Sign Up" });
};

// sign in page
export const signIn = (req:Request, res:Response) => {
  res.render("auth/login", { title: "Login" });
};

// forgot password page
export const forgot = async (req:Request, res:Response) => {
  res.render("auth/forgotPassword", { title: "Forgot Password" });
};

// reset password page
export const resetPassword = async (req:Request, res:Response) => {
  res.render("auth/resetPassword", { title: "Reset Password" });
};

// edit profile page
export const editProfile = (req:Request, res:Response) => {
  res.render("garage/editProfile", { title: "Edit Profile" });
};

// logout user
export const logout = (req:Request, res:Response) => {
  res.clearCookie("token");
  res.redirect("/u/signIn");
};