package de.cinovo.cloudconductor.api.interfaces;

/*
 * #%L
 * cloudconductor-api
 * %%
 * Copyright (C) 2013 - 2014 Cinovo AG
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
import de.cinovo.cloudconductor.api.MediaType;
import de.cinovo.cloudconductor.api.model.PackageServerGroup;

import javax.ws.rs.*;

/**
 * Copyright 2013 Cinovo AG<br>
 * <br>
 * 
 * @author psigloch
 * 
 */
@Path("/packageservergroup")
public interface IPackageServerGroup {
	
	/**
	 * @return set of api objects
	 */
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	PackageServerGroup[] get();
	
	/**
	 * @param id the {@link PackageServerGroup} id
	 * @return the {@link PackageServerGroup}
	 */
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	PackageServerGroup get(@PathParam("id") Long id);
	
	/**
	 * @param group the {@link PackageServerGroup}
	 * @return the new id
	 */
	@POST
	@Path("/")
	Long newGroup(PackageServerGroup group);
	
	/**
	 * @param group the {@link PackageServerGroup}
	 */
	@PUT
	@Path("/")
	void edit(PackageServerGroup group);
	
	/**
	 * @param id the id of the the {@link PackageServerGroup} to delete
	 */
	@DELETE
	@Path("/{id}")
	void delete(@PathParam("id") Long id);
}
