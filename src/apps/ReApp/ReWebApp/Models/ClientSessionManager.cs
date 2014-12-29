using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Diagnostics;

namespace Gtm.ReWebApp.Models
{
    public class ClientSessionManager
    {
        #region members
        private static readonly ClientSessionManager clientSessionManager;

        private readonly Dictionary<string, ClientSession> _clienSessions;
        #endregion

        #region properties
        public static ClientSessionManager Instance
        {
            get { return ClientSessionManager.clientSessionManager; }
        }
        #endregion

        #region constructors
        static ClientSessionManager()
        {
            ClientSessionManager.clientSessionManager = new ClientSessionManager();
        }

        private ClientSessionManager()
        {
            this._clienSessions = new Dictionary<string, ClientSession>();
        }
        #endregion

        #region methods

        #region public
        public ClientSession CreateClientSession()
        {
            ClientSession newClientSession = new ClientSession();

            lock (this._clienSessions)
            {
                this._clienSessions.Add(newClientSession.SessionGuid, newClientSession);
            }

            return newClientSession;
        }

        public void DestroyClientSession(ClientSession clientSession)
        {
            lock (this._clienSessions)
            {
                this._clienSessions.Remove(clientSession.SessionGuid);
            }
        }

        public ClientSession GetClientSession(string csid)
        {
            Debug.Assert(!string.IsNullOrEmpty(csid), "unexpected client session id");

            ClientSession clientSession;
            lock(this._clienSessions)
            {
                this._clienSessions.TryGetValue(csid, out clientSession);
            }

            Debug.Assert(null != clientSession, "client session not found");
            return clientSession;
        }
        #endregion

        #endregion
    }
}