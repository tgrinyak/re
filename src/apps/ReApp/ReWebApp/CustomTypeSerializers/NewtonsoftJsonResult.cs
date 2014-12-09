using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Converters;
using System.IO;

namespace Gtm.ReWebApp.CustomTypeSerializers
{
    public class NewtonsoftJsonResult : JsonResult, IDisposable
    {
        //public LanguageFile Language;
        //public bool Translate { get; set; }
        private JsonSerializer _jsinSerializer;

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            var response = context.HttpContext.Response;

            response.ContentType = !String.IsNullOrEmpty(ContentType) ? ContentType : "application/json";

            if (ContentEncoding != null)
            {
                response.ContentEncoding = ContentEncoding;
            }

            if (Data == null)
                return;

            //will turn null referenced object in no value rather than sending back a null
            this._jsinSerializer = JsonSerializer.Create(new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    MissingMemberHandling = MissingMemberHandling.Ignore,
                });

            this._jsinSerializer.Error += this.jsinSerializer_Error;

            this._jsinSerializer.Converters.Add(new IsoDateTimeConverter());
            this._jsinSerializer.Converters.Add(new DictionaryConverter());
            //if (Translate)
            //{
            //    this._jsinSerializer.Converters.Add(new LocalizationConverter());
            //}



            //using (MiniProfiler.Current.Step("Serialize to JSON (NewtonSoft)"))
            //{
                using (var writer = new StreamWriter(response.OutputStream))
                {
                    this._jsinSerializer.Serialize(writer, Data);
                }
            //}
        }

        void jsinSerializer_Error(object sender, Newtonsoft.Json.Serialization.ErrorEventArgs e)
        {
            //Log.Warning("Json (newtonsoft) serialization error : " + errorEventArgs.ErrorContext.Error.Message);
            e.ErrorContext.Handled = true;
        }

        public void Dispose()
        {
            this._jsinSerializer.Error -= this.jsinSerializer_Error;
            this._jsinSerializer = null;
        }
    }
}