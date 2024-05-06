import React, { useState, useEffect } from 'react';
import { User, useAuth } from '../context/AuthContext';
import { TicketAPI } from '../services/api';
import LoginForm from './LoginForm';
import Moment from 'react-moment';

interface Ticket {
  id: number;
  name: string;
  email: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved';
  updatedAt: string;
  createdAt: string;
  responses: Response[];
}

interface Response {
  id: number;
  description: string;
  ticket: Ticket;
  user: User;
  createdAt: string;
}

const statusOrder = {
  new: 1,
  in_progress: 2,
  resolved: 3,
};


const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newResponse, setNewResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let fetchedTickets: Ticket[] = await TicketAPI.fetchAll();
        fetchedTickets = fetchedTickets.sort((a, b) => {
          const statusCompare = statusOrder[a.status] - statusOrder[b.status];
          if (statusCompare !== 0) {
            return statusCompare;
          }
          const dateA = new Date(a.updatedAt);
          const dateB = new Date(b.updatedAt);
          return dateB.getTime() - dateA.getTime();
        });
        setTickets(fetchedTickets);
        if (fetchedTickets.length > 0) {
          setSelectedTicket(fetchedTickets[0]);
        }
      } catch (error: any) {
        setError(error.message || 'An error occurred while fetching tickets.');
      }
    };

    if (currentUser) {
      fetchTickets();
    }
  }, [currentUser]);

  const categorizedTickets = {
    new: tickets.filter(ticket => ticket.status === 'new'),
    in_progress: tickets.filter(ticket => ticket.status === 'in_progress'),
    resolved: tickets.filter(ticket => ticket.status === 'resolved'),
  };

  const submitResponse = async () => {
    setError('');
    if (newResponse.length === 0) {
      setError('Response can not be empty.');
    } else if (selectedTicket && currentUser) {
      try {
        const response: Ticket = await TicketAPI.addResponse(selectedTicket.id, currentUser.id, newResponse);
                console.log(`This would send an email to ${selectedTicket.email} letting them know there was an update to their ticket by ${currentUser.name} with response: "${newResponse}"`);
        setSelectedTicket(response);
        setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, updatedAt: response.updatedAt } : t));
        setNewResponse('');
      } catch (error: any) {
        setError(error.message || 'An error occurred while adding the response.');
      }
    }
  };

  const updateStatus = async (status: Ticket['status']) => {
    if (selectedTicket) {
      try {
        await TicketAPI.updateStatus(selectedTicket.id, status);
        setSelectedTicket({ ...selectedTicket, status });
        setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status } : t));
      } catch (error: any) {
        setError(error.message || 'An error occurred while updating ticket status.');
      }
    }
  };

  if (!currentUser) {
    return <LoginForm onLoginSuccess={() => {}} />;
  }

  return (
    <div id="admin" className="container-fluid">
      <div className="row">
        <div id="side-panel" className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
          {Object.entries(categorizedTickets).map(([status, ticketsOfStatus]) => (
            <React.Fragment key={status}>
              <h4 className="status-heading">{status.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</h4>
              {ticketsOfStatus.length > 0 ? (
                <table className="table">
                  <tbody>
                    {ticketsOfStatus.map(ticket => (
                      <tr key={ticket.id} className={`ticket-summary ${ticket.status} ${(selectedTicket && ticket.id === selectedTicket.id) ? 'active' : ''}`} onClick={() => setSelectedTicket(ticket)}>
                        <td className="status-cell">
                          <span className={`status ${ticket.status.replace('_', '-')}`}></span>
                        </td>
                        <td className="summary-cell">
                          <p className="user">{ticket.name} <Moment fromNow ago>{ticket.updatedAt}</Moment></p>
                          <p className="summary">{ticket.description.substring(0, 140) + (ticket.description.length <= 140 ? '' : '...')}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-tickets">No Tickets</p>
              )}
            </React.Fragment>
          ))}
        </div>
        <div id="main-panel" className="col-xs-9 col-sm-9 col-md-9 col-lg-9">
          {selectedTicket && (
            <div className="container-fluid ticket-view">
              <div className="row">
                <div className="summary-details col-xs-8 col-sm-8 col-md-8 col-lg-8">
                  <h5>Ticket Summary</h5>
                  <p className="summary">{selectedTicket.description}</p>
                  <h5>Responses <span className="badge rounded-pill response-count">{selectedTicket.responses.length}</span></h5>
                  <div className="responses">
                    {selectedTicket.responses.length > 0 ? (
                      <table className="table">
                        <tbody>
                          {selectedTicket.responses.map((response) => (
                            <tr key={response.id} className="response-summary">
                              <td className="summary-cell">
                                <p className="user">{response.user.name} <Moment fromNow ago>{response.createdAt}</Moment></p>
                                <p className="summary">{response.description}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : ('')}
                    <textarea className="form-control" placeholder="Add a response to this ticket" value={newResponse} onChange={(e) => setNewResponse(e.target.value)} />
                    <button id="respond-button" className="btn btn-default btn-submit" onClick={submitResponse}>Add Response</button>
                  </div>
                </div>
                <div className="update-status col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <div className="ticket-details">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="label">
                            <p className="side-label">Status:</p>
                          </td>
                          <td className="content">
                            <select className={`form-control form-select ${selectedTicket.status.replace('_', '-')}`} value={selectedTicket.status} onChange={(e) => updateStatus(e.target.value as Ticket['status'])}>
                              <option value="new">New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td className="label">
                            <p className="side-label">User:</p>
                          </td>
                          <td className="content">
                            <p className="main">{selectedTicket.name}</p>
                            <p className="subtext">{selectedTicket.email}</p>
                          </td>
                        </tr>
                        <tr>
                          <td className="label">
                            <p className="side-label">Created:</p>
                          </td>
                          <td className="content">
                            <p className="subtext"><Moment fromNow>{selectedTicket.createdAt}</Moment></p>
                          </td>
                        </tr>
                        <tr>
                          <td className="label">
                            <p className="side-label">Updated:</p>
                          </td>
                          <td className="content">
                            <p className="subtext"><Moment fromNow>{selectedTicket.updatedAt}</Moment></p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;