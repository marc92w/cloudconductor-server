package de.cinovo.cloudconductor.server.handler;

import de.cinovo.cloudconductor.api.enums.ServiceState;
import de.cinovo.cloudconductor.api.model.ServiceStatesChanges;
import de.cinovo.cloudconductor.server.dao.IServiceStateDAO;
import de.cinovo.cloudconductor.server.model.EServiceState;
import de.cinovo.cloudconductor.server.websockets.model.WSChangeEvent;
import de.cinovo.cloudconductor.server.websockets.model.WSChangeEvent.ChangeType;
import de.cinovo.cloudconductor.server.ws.host.HostDetailWSHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Copyright 2018 Cinovo AG<br>
 * <br>
 *
 * @author psigloch
 */
@Service
public class ServiceStateHandler {

	@Autowired
	private IServiceStateDAO serviceStateDAO;
	@Autowired
	private HostDetailWSHandler hostDetailWsHandler;

	public EServiceState handleStartedService(EServiceState serviceState, ServiceStatesChanges stateChanges) {
		switch(serviceState.getState()) {
			case RESTARTING_STARTING:
			case STARTING:
				serviceState.nextState();
				EServiceState save = this.serviceStateDAO.save(serviceState);
				// service is now started, inform user interface via WS
				this.hostDetailWsHandler.broadcastChange(save.getHost().getName(), new WSChangeEvent<>(ChangeType.UPDATED, save.getHost().toApi()));
				return save;
			case STOPPING:
				stateChanges.getToStop().add(serviceState.getService().getInitScript());
				break;
			case RESTARTING_STOPPING:
				serviceState.nextState();
				stateChanges.getToRestart().add(serviceState.getService().getInitScript());
				return this.serviceStateDAO.save(serviceState);
			case STOPPED:
				serviceState.setState(ServiceState.STOPPING);
				stateChanges.getToStop().add(serviceState.getService().getInitScript());
				return this.serviceStateDAO.save(serviceState);
			default:
				break;
		}
		return serviceState;
	}

	public EServiceState handleStopedService(EServiceState serviceState, ServiceStatesChanges stateChanges) {
		switch(serviceState.getState()) {
			case STARTING:
				stateChanges.getToStart().add(serviceState.getService().getInitScript());
				break;
			case STOPPING:
				serviceState.nextState();
				EServiceState save = this.serviceStateDAO.save(serviceState);
				// service is now stopped, inform user interface via WS
				this.hostDetailWsHandler.broadcastChange(save.getHost().getName(), new WSChangeEvent<>(ChangeType.UPDATED, save.getHost().toApi()));
				return save;
			case STARTED:
				stateChanges.getToStart().add(serviceState.getService().getInitScript());
				serviceState.setState(ServiceState.STARTING);
				return this.serviceStateDAO.save(serviceState);
			default:
				break;
		}
		return serviceState;
	}

}