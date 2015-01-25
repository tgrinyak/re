using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using Gtm.ReWebApp.Attributes;
using Gtm.ReWebApp.Models;
using Gtm.ReWebApp.Models.JsonResponses;
using Npgsql;

namespace Gtm.ReWebApp.Controllers
{
    public class LoginController : AbstractController
    {
        private static readonly Dictionary<string, string> LOGIN_FAILED_MESSAGE_TEXT;
        //private static readonly Dictionary<string, string> OPEN_DB_FAILED_MESSAGE_TEXT;
        //private static readonly Dictionary<string, string> EXECUTE_DB_QUERY_MESSAGE_TEXT;

        static LoginController()
        {
            LOGIN_FAILED_MESSAGE_TEXT = new Dictionary<string, string>();
            LOGIN_FAILED_MESSAGE_TEXT.Add("en", "login failed, either user name or password or both are wrong");
            LOGIN_FAILED_MESSAGE_TEXT.Add("jp", "ユーザー名やパスワードや両方と正しくありません");

            //OPEN_DB_FAILED_MESSAGE_TEXT = new Dictionary<string, string>();
            //OPEN_DB_FAILED_MESSAGE_TEXT.Add("en", "execute database request failed");
            //OPEN_DB_FAILED_MESSAGE_TEXT.Add("jp", "データベース要求失敗しました");

            //EXECUTE_DB_QUERY_MESSAGE_TEXT = new Dictionary<string, string>();
            //EXECUTE_DB_QUERY_MESSAGE_TEXT.Add("en", "open database connection failed");
            //EXECUTE_DB_QUERY_MESSAGE_TEXT.Add("jp", "データベース接続失敗しました");
        }

        [ClientSessionFilter(ClientSessionRequires = false)]
        public ActionResult login(string un, string pw)
        {
            if (null == base.ClientSession)
            {
                base.ClientSession = ClientSessionManager.Instance.CreateClientSession();
                base.ClientSession.Localization = !string.IsNullOrEmpty(base.HttpContext.Request.Params[ClientSessionFilterAttribute.CLIENT_SESSION_LOCALIZATION_NAME])
                                        ? base.HttpContext.Request.Params[ClientSessionFilterAttribute.CLIENT_SESSION_LOCALIZATION_NAME]
                                        : "en";
            }

            // here we query db for to verify credentials
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
                        dbCommand.CommandText = "SELECT role FROM userCredentialsTbl WHERE email=:email AND password=:pw;";
                        dbCommand.Parameters.AddWithValue(":email", un);
                        dbCommand.Parameters.AddWithValue(":pw", pw);
                        try
                        {
                            using (var reader = dbCommand.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    ClientRoleEnum role;
                                    var value0 = reader.GetString(0);
                                    if (!Enum.TryParse(reader.GetString(0), true, out role))
                                    {
                                        role = ClientRoleEnum.Undefined;
                                    }
                                    base.ClientSession.Role = role;

                                    if (ClientRoleEnum.Undefined != base.ClientSession.Role)
                                    {
                                        base.ClientSession.UserName = un;

                                        // success behaviour
                                        Dictionary<string, object> responseParam = new Dictionary<string, object>();
                                        responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                                        responseParam.Add("uName", un);
                                        responseParam.Add("uRole", base.ClientSession.Role.ToString("F"));

                                        jsonResponse = new SuccessJsonResponse(responseParam);
                                    }
                                    else
                                    {
                                        Dictionary<string, object> responseParam = new Dictionary<string, object>();
                                        responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                                        responseParam.Add("message", LOGIN_FAILED_MESSAGE_TEXT[base.ClientSession.Localization]);

                                        jsonResponse = new ErrorJsonResponse(responseParam);
                                    }
                                }
                                else
                                {
                                    Dictionary<string, object> responseParam = new Dictionary<string, object>();
                                    responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);
                                    responseParam.Add("message", LOGIN_FAILED_MESSAGE_TEXT[base.ClientSession.Localization]);

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
            }

            return Json(jsonResponse);
        }

        [ClientSessionFilter(ClientSessionRequires = false)]
        public ActionResult logout()
        {
            if(null != base.ClientSession)
            {
                ClientSessionManager.Instance.DestroyClientSession(base.ClientSession);
            }

            Dictionary<string, object> responseParam = new Dictionary<string, object>();
            responseParam.Add(ClientSessionFilterAttribute.CLIENT_SESSION_ID_ITEM_NAME, base.ClientSession.SessionGuid);

            return Json(new SuccessJsonResponse(responseParam));
        }
    }
}