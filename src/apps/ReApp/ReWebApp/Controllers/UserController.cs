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
    public class UserController : AbstractController
    {
        private static readonly Dictionary<string, string> USER_NOT_FOUND_MESSAGE_TEXT;

        static UserController()
        {
            USER_NOT_FOUND_MESSAGE_TEXT = new Dictionary<string, string>();
            USER_NOT_FOUND_MESSAGE_TEXT.Add("en", "application error: haven't found user '{0}' information");
            USER_NOT_FOUND_MESSAGE_TEXT.Add("jp", "アプリケーションエラー：ユーザー’{0}’詳細情報見つかりませんでした");
        }
        // GET: User
        public ActionResult Index()
        {
            if (ClientRoleEnum.User == (base.ClientSession.Role & ClientRoleEnum.User))
            {
                return View();
            }
            else
            {
                return Redirect("Error/Index");
            }
        }

        public ActionResult Load(string userName)
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
                                                       "FROM userCredentialsTbl WHERE email=:un LIMIT 1;";
                        dbCommand.Parameters.AddWithValue(":un", userName);
                        try
                        {
                            using (var reader = dbCommand.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    Dictionary<string, object> record = new Dictionary<string, object>();
                                    for (int i = 0; i < reader.FieldCount; ++i)
                                    {
                                        record.Add(reader.GetName(i), reader.GetValue(i));
                                    }

                                    Dictionary<string, object> responseParam = new Dictionary<string, object>();
                                    responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                                    responseParam.Add("user", record);

                                    jsonResponse = new SuccessJsonResponse(responseParam);
                                }
                                else
                                {
                                    Dictionary<string, object> responseParam = new Dictionary<string, object>();
                                    responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                                    responseParam.Add("message", USER_NOT_FOUND_MESSAGE_TEXT[base.ClientSession.Localization]);

                                    jsonResponse = new ErrorJsonResponse(responseParam);
                                }
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

                return Json(jsonResponse);
            }
        }
    }
}