using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using Gtm.ReWebApp.Models;
using Gtm.ReWebApp.Attributes;
using Gtm.ReWebApp.Models.JsonResponses;
using Gtm.ReWebApp.Models.Exceptions;
using Npgsql;


namespace Gtm.ReWebApp.Controllers
{
    public class AdminController : AbstractController
    {
        // GET: Admin
        public ActionResult Index()
        {
            if (ClientRoleEnum.Admin == (base.ClientSession.Role & ClientRoleEnum.Admin))
            {
                return View();
            }
            else
            {
                return Redirect("Error/Index");
            }
        }

        public ActionResult Load(int userCount)
        {
            AbstractJsonResponse jsonResponse = null;
            using (var dbConnection = new NpgsqlConnection())
            {
                dbConnection.ConnectionString = ConfigurationManager.ConnectionStrings["DbConnection"].ConnectionString;

                try
                {
                    dbConnection.Open();
                    using (var dbCommand = new NpgsqlCommand())
                    {
                        dbCommand.Connection = dbConnection;
                        dbCommand.CommandText = "SELECT email, role, first_name, first_name_furigana, last_name, last_name_furigana, date_of_birth, sex, " +
                                                       "contact_information, post_number, address, registrated_service, loan_payment_period, loan_value " +
                                                       "FROM userCredentialsTbl WHERE role='user' LIMIT :uc;";
                        dbCommand.Parameters.AddWithValue(":uc", userCount + 1);
                        try
                        {
                            using (var reader = dbCommand.ExecuteReader())
                            {
                                List<Dictionary<string, object>> records = new List<Dictionary<string, object>>();
                                int recordCounter = 0;
                                while (reader.Read())
                                {
                                    if (++recordCounter > userCount)
                                    {
                                        break;
                                    }

                                    Dictionary<string, object> record = new Dictionary<string, object>();
                                    for (int i = 0; i < reader.FieldCount; ++i)
                                    {
                                        var value = reader.GetValue(i);
                                        if (value is DateTime)
                                        {
                                            record.Add(reader.GetName(i), ((DateTime)value).ToString("yyyy-MM-dd"));
                                        }
                                        else
                                        {
                                            record.Add(reader.GetName(i), value);
                                        }
                                    }
                                    records.Add(record);
                                }
                                Dictionary<string, object> responseParam = new Dictionary<string, object>();
                                responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                                responseParam.Add("meta", new string[] { "email", "role", "first_name", "first_name_furigana",
                                                                         "last_name", "last_name_furigana", "date_of_birth",
                                                                         "sex", "contact_information", "post_number", "address",
                                                                         "registrated_service", "loan_payment_period", "loan_value" });
                                responseParam.Add("users", records.ToArray());
                                responseParam.Add("isMoreUsersAvailable", recordCounter > userCount);

                                jsonResponse = new SuccessJsonResponse(responseParam);
                            }
                        }
                        catch (Exception ex)
                        {
                            Dictionary<string, object> responseParam = new Dictionary<string, object>();
                            responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                            responseParam.Add("message", EXECUTE_DB_QUERY_MESSAGE_TEXT[base.ClientSession.Localization]);
                            responseParam.Add("sqlQuery", dbCommand.CommandText);
                            responseParam.Add("exceptionMessage", ex.Message);
                            responseParam.Add("exceptionType", ex.GetType().ToString());
                            responseParam.Add("exceptionStackTrace", ex.StackTrace);

                            jsonResponse = new ErrorJsonResponse(responseParam);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Dictionary<string, object> responseParam = new Dictionary<string, object>();
                    responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                    responseParam.Add("message", OPEN_DB_FAILED_MESSAGE_TEXT[base.ClientSession.Localization]);
                    responseParam.Add("exceptionMessage", ex.Message);
                    responseParam.Add("exceptionType", ex.GetType().ToString());
                    responseParam.Add("exceptionStackTrace", ex.StackTrace);

                    jsonResponse = new ErrorJsonResponse(responseParam);
                }
            }

            return Json(jsonResponse);
        }

        public ActionResult NewUser(string jsonUser)
        {
            AbstractJsonResponse jsonResponse = null;
            try
            {
                Dictionary<string, object> user = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonUser);

                Dictionary<string, object> record = CheckNewUser(user);
                using (var dbConnection = new NpgsqlConnection())
                {
                    dbConnection.ConnectionString = ConfigurationManager.ConnectionStrings["DbConnection"].ConnectionString;

                    try
                    {
                        dbConnection.Open();
                        using (var dbCommand = new NpgsqlCommand())
                        {
                            dbCommand.Connection = dbConnection;
                            dbCommand.CommandText = "INSERT INTO userCredentialsTbl (email, role, password, first_name, first_name_furigana, " +
                                                           "last_name, last_name_furigana, date_of_birth, sex, contact_information, post_number, " +
                                                           "address, registrated_service, loan_payment_period, loan_value) " +
                                                           "VALUES (:p1, :p2, :p3, :p4, :p5, :p6, :p7, :p8, :p9, :p10, :p11, :p12, :p13, :p14, :p15);";
                            dbCommand.Parameters.AddWithValue(":p1", record["email"]);
                            dbCommand.Parameters.AddWithValue(":p2", record["role"]);
                            dbCommand.Parameters.AddWithValue(":p3", record["password"]);
                            dbCommand.Parameters.AddWithValue(":p4", record["first_name"]);
                            dbCommand.Parameters.AddWithValue(":p5", record["first_name_furigana"]);
                            dbCommand.Parameters.AddWithValue(":p6", record["last_name"]);
                            dbCommand.Parameters.AddWithValue(":p7", record["last_name_furigana"]);
                            dbCommand.Parameters.AddWithValue(":p8", record["date_of_birth"]);
                            dbCommand.Parameters.AddWithValue(":p9", record["sex"]);
                            dbCommand.Parameters.AddWithValue(":p10", record["contact_information"]);
                            dbCommand.Parameters.AddWithValue(":p11", record["post_number"]);
                            dbCommand.Parameters.AddWithValue(":p12", record["address"]);
                            dbCommand.Parameters.AddWithValue(":p13", record["registrated_service"]);
                            dbCommand.Parameters.AddWithValue(":p14", record["loan_payment_period"]);
                            dbCommand.Parameters.AddWithValue(":p15", record["loan_value"]);
                            try
                            {
                                var noQueryResult = dbCommand.ExecuteNonQuery();

                                Dictionary<string, object> responseParam = new Dictionary<string, object>();
                                responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                                responseParam.Add("dbResult", noQueryResult);

                                jsonResponse = new SuccessJsonResponse(responseParam);
                            }
                            catch (Exception ex)
                            {
                                Dictionary<string, object> responseParam = new Dictionary<string, object>();
                                responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                                responseParam.Add("message", EXECUTE_DB_QUERY_MESSAGE_TEXT[base.ClientSession.Localization]);
                                responseParam.Add("sqlQuery", dbCommand.CommandText);
                                responseParam.Add("exceptionMessage", ex.Message);
                                responseParam.Add("exceptionType", ex.GetType().ToString());
                                responseParam.Add("exceptionStackTrace", ex.StackTrace);

                                jsonResponse = new ErrorJsonResponse(responseParam);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Dictionary<string, object> responseParam = new Dictionary<string, object>();
                        responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                        responseParam.Add("message", OPEN_DB_FAILED_MESSAGE_TEXT[base.ClientSession.Localization]);
                        responseParam.Add("exceptionMessage", ex.Message);
                        responseParam.Add("exceptionType", ex.GetType().ToString());
                        responseParam.Add("exceptionStackTrace", ex.StackTrace);

                        jsonResponse = new ErrorJsonResponse(responseParam);
                    }
                }
            }
            catch (Exception ex)
            {
                Dictionary<string, object> responseParam = new Dictionary<string, object>();
                responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                responseParam.Add("message", "json parser failed");
                responseParam.Add("exceptionMessage", ex.Message);
                responseParam.Add("exceptionType", ex.GetType().ToString());
                responseParam.Add("exceptionStackTrace", ex.StackTrace);

                jsonResponse = new ErrorJsonResponse(responseParam);
            }


            return Json(jsonResponse);
        }

        private static Dictionary<string, object> CheckNewUser(Dictionary<string, object> user)
        {
            Dictionary<string, object> record = new Dictionary<string, object>();
            if (user.ContainsKey("email"))
            {
                record.Add("email", user["email"]);
            }
            else
            {
                throw new UserInfoVerificationException("email must be specified", "email");
            }

            if (user.ContainsKey("role"))
            {
                switch((string)user["role"])
                {
                    case "admin":
                        record.Add("role", "admin");
                        break;
                    case "user":
                        record.Add("role", "user");
                        break;
                    default:
                        throw new UserInfoVerificationException("role must be either 'admin' or 'user' value", "role");
                }
            }
            else
            {
                throw new UserInfoVerificationException("role must be specified", "role");
            }

            if (user.ContainsKey("password"))
            {
                record.Add("password", user["password"]);
            }
            else
            {
                throw new UserInfoVerificationException("password must be specified", "password");
            }

            if (user.ContainsKey("first_name"))
            {
                record.Add("first_name", user["first_name"]);
            }
            else
            {
                record.Add("first_name", System.DBNull.Value);
            }

            if (user.ContainsKey("first_name_furigana"))
            {
                record.Add("first_name_furigana", user["first_name_furigana"]);
            }
            else
            {
                record.Add("first_name_furigana", System.DBNull.Value);
            }

            if (user.ContainsKey("last_name"))
            {
                record.Add("last_name", user["last_name"]);
            }
            else
            {
                record.Add("last_name", System.DBNull.Value);
            }

            if (user.ContainsKey("last_name_furigana"))
            {
                record.Add("last_name_furigana", user["last_name_furigana"]);
            }
            else
            {
                record.Add("last_name_furigana", System.DBNull.Value);
            }

            if (user.ContainsKey("date_of_birth"))
            {
                record.Add("date_of_birth", DateTime.Parse((string)user["date_of_birth"]));
            }
            else
            {
                record.Add("date_of_birth", System.DBNull.Value);
            }

            if (user.ContainsKey("sex"))
            {
                switch ((string)user["sex"])
                {
                    case "M":
                        record.Add("sex", "M");
                        break;
                    case "F":
                        record.Add("sex", "F");
                        break;
                    default:
                        throw new UserInfoVerificationException("sex must be either 'M' or 'F' value", "sex");
                }
            }
            else
            {
                record.Add("sex", System.DBNull.Value);
            }

            if (user.ContainsKey("contact_information"))
            {
                record.Add("contact_information", user["contact_information"]);
            }
            else
            {
                record.Add("contact_information", System.DBNull.Value);
            }

            if (user.ContainsKey("post_number"))
            {
                record.Add("post_number", user["post_number"]);
            }
            else
            {
                record.Add("post_number", System.DBNull.Value);
            }

            if (user.ContainsKey("address"))
            {
                record.Add("address", user["post_number"]);
            }
            else
            {
                record.Add("address", System.DBNull.Value);
            }

            if (user.ContainsKey("registrated_service"))
            {
                record.Add("registrated_service", user["registrated_service"]);
            }
            else
            {
                record.Add("registrated_service", System.DBNull.Value);
            }

            if (user.ContainsKey("loan_payment_period"))
            {
                record.Add("loan_payment_period", user["loan_payment_period"]);
            }
            else
            {
                record.Add("loan_payment_period", System.DBNull.Value);
            }

            if (user.ContainsKey("loan_value"))
            {
                record.Add("loan_value", user["loan_value"]);
            }
            else
            {
                record.Add("loan_value", System.DBNull.Value);
            }

            return record;
        }
    }
}