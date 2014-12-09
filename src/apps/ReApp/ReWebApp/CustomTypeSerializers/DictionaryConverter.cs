using System;
using System.Collections;
using System.Linq;
using Newtonsoft.Json;

namespace Gtm.ReWebApp.CustomTypeSerializers
{
    public class DictionaryConverter : JsonConverter
    {
        #region methods
        /// <summary>
        /// Writes the JSON representation of a Dictionary.
        /// </summary>
        /// <param name="writer">The <see cref="T:Newtonsoft.Json.JsonWriter"/> to write to.</param>
        /// <param name="value">The value.</param>
        /// <param name="serializer">The calling serializer.</param>
        /// <note>This method won't properly serialize key values in the dictionary if the key is a complex object</note>
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var dicoValues = (IDictionary)value;
            var started = false;
            foreach (var realValue in dicoValues)
            {
                var entry = (DictionaryEntry)realValue;

                if (serializer.NullValueHandling == NullValueHandling.Ignore)
                {
                    if (entry.Value == null ||
                        entry.Value is String && String.IsNullOrEmpty((string)entry.Value))
                    {
                        continue;
                    }
                }

                if (!started)
                {
                    writer.WriteStartObject();
                    started = true;
                }
                writer.WritePropertyName(entry.Key.ToString());
                serializer.Serialize(writer, entry.Value);
                writer.Flush();
            }
            if (started)
            {
                writer.WriteEndObject();
            }
        }

        /// <summary>
        /// Reads the JSON representation of the object.
        /// </summary>
        /// <param name="reader">The <see cref="T:Newtonsoft.Json.JsonReader"/> to read from.</param>
        /// <param name="objectType">Type of the object.</param>
        /// <param name="existingValue">The existing value of object being read.</param>
        /// <param name="serializer">The calling serializer.</param>
        /// <returns>
        /// The object value.
        /// </returns>
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotSupportedException();
        }

        /// <summary>
        /// Determines whether this instance can convert the specified object type.
        /// </summary>
        /// <param name="objectType">Type of the object.</param>
        /// <returns>
        /// <c>true</c> if this instance can convert the specified object type; otherwise, <c>false</c>.
        /// </returns>
        public override bool CanConvert(Type objectType)
        {
            return objectType.GetInterfaces().Any(inter => inter == typeof(IDictionary));
        }
        #endregion
    }
}