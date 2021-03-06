package de.cinovo.cloudconductor.server.dao;

import de.cinovo.cloudconductor.server.model.EAgent;
import de.taimos.dvalin.jpa.IEntityDAO;

/**
 * Copyright 2016 Cinovo AG<br>
 * <br>
 *
 * @author ablehm
 */
public interface IAgentDAO extends IEntityDAO<EAgent, Long> {
	/**
	 * @param agentName the name of the agent
	 * @return the agent with unique name
	 */
	EAgent findAgentByName(String agentName);
}
