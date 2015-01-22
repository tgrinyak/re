using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using Gtm.ReWebApp.Models;
using Gtm.ReWebApp.Attributes;
using Gtm.ReWebApp.Models.JsonResponses;
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
                                        record.Add(reader.GetName(i), reader.GetValue(i));
                                    }
                                    records.Add(record);
                                }
                                Dictionary<string, object> responseParam = new Dictionary<string, object>();
                                responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                                responseParam.Add("users", records.ToArray());
                                responseParam.Add("isMoreUsersAvailable", recordCounter > userCount);

                                jsonResponse = new SuccessJsonResponse(responseParam);
                            }
                        }
                        catch (Exception ex)
                        {
                            Dictionary<string, object> responseParam = new Dictionary<string, object>();
                            responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                            responseParam.Add("message", "execute database request failed");
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
                    responseParam.Add("message", "open database connection failed");
                    responseParam.Add("exceptionMessage", ex.Message);
                    responseParam.Add("exceptionType", ex.GetType().ToString());
                    responseParam.Add("exceptionStackTrace", ex.StackTrace);

                    jsonResponse = new ErrorJsonResponse(responseParam);
                }
            }

            return Json(jsonResponse);
        }
    }
}