package de.cinovo.cloudconductor.server.handler;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;

import javax.ws.rs.WebApplicationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import de.cinovo.cloudconductor.api.model.ConfigFile;
import de.cinovo.cloudconductor.api.model.Directory;
import de.cinovo.cloudconductor.server.dao.IDirectoryDAO;
import de.cinovo.cloudconductor.server.dao.IFileDAO;
import de.cinovo.cloudconductor.server.dao.IFileDataDAO;
import de.cinovo.cloudconductor.server.dao.IPackageDAO;
import de.cinovo.cloudconductor.server.dao.IServiceDAO;
import de.cinovo.cloudconductor.server.dao.ITemplateDAO;
import de.cinovo.cloudconductor.server.model.EDirectory;
import de.cinovo.cloudconductor.server.model.EFile;
import de.cinovo.cloudconductor.server.model.EFileData;
import de.cinovo.cloudconductor.server.model.EService;
import de.cinovo.cloudconductor.server.model.ETemplate;
import de.taimos.restutils.RESTAssert;

/**
 * Copyright 2017 Cinovo AG<br>
 * <br>
 *
 * @author psigloch
 */
@Service
public class FileHandler {
	
	@Autowired
	private IFileDAO fileDAO;
	@Autowired
	private IFileDataDAO fileDataDAO;
	@Autowired
	private IDirectoryDAO directoryDAO;
	@Autowired
	private IPackageDAO packageDAO;
	@Autowired
	private IServiceDAO serviceDAO;
	@Autowired
	private ITemplateDAO templateDAO;
	
	
	/**
	 * @param cf the config file
	 * @return the saved file entity
	 * @throws WebApplicationException on error
	 */
	public EFile createEntity(ConfigFile cf) throws WebApplicationException {
		EFile ef = new EFile();
		ef = this.fillFields(ef, cf);
		RESTAssert.assertNotNull(ef);
		return this.fileDAO.save(ef);
	}
	
	/**
	 * @param ef the file entity to update
	 * @param cf the config file used to update the entity
	 * @return the updated, saved file entity
	 * @throws WebApplicationException on error
	 */
	public EFile updateEntity(EFile ef, ConfigFile cf) throws WebApplicationException {
		ef = this.fillFields(ef, cf);
		RESTAssert.assertNotNull(ef);
		return this.fileDAO.save(ef);
	}
	
	/**
	 * @param dir the directory
	 * @return the saved dir entity
	 * @throws WebApplicationException on error
	 */
	public EDirectory createEntity(Directory dir) throws WebApplicationException {
		EDirectory edir = new EDirectory();
		edir = this.fillFields(edir, dir);
		RESTAssert.assertNotNull(edir);
		return this.directoryDAO.save(edir);
	}
	
	/**
	 * @param edir the directory entity to update
	 * @param dir the directory used to update the entity
	 * @return the updated, saved directory entity
	 * @throws WebApplicationException on error
	 */
	public EDirectory updateEntity(EDirectory edir, Directory dir) throws WebApplicationException {
		edir = this.fillFields(edir, dir);
		RESTAssert.assertNotNull(edir);
		return this.directoryDAO.save(edir);
	}
	
	/**
	 * 
	 * @param efile the file
	 * @param data the data as a string
	 * @return the new create file data
	 */
	public EFileData createEntity(EFile efile, String data) {
		EFileData edata = new EFileData();
		edata.setParent(efile);
		edata = this.fillFields(edata, data);
		RESTAssert.assertNotNull(edata);
		return this.fileDataDAO.save(edata);
	}
	
	/**
	 * @param edata the file data
	 * @param data the updated data as a string
	 * @return the updated file data
	 */
	public EFileData updateEntity(EFileData edata, String data) {
		edata = this.fillFields(edata, data);
		RESTAssert.assertNotNull(edata);
		return this.fileDataDAO.save(edata);
	}
	
	private EFile fillFields(EFile ef, ConfigFile cf) {
		ef.setName(cf.getName());
		ef.setFileMode(cf.getFileMode());
		ef.setChecksum(cf.getChecksum());
		ef.setGroup(cf.getGroup());
		ef.setOwner(cf.getOwner());
		ef.setReloadable(cf.isReloadable());
		ef.setTemplate(cf.isTemplate());
		ef.setDirectory(cf.isDirectory());
		ef.setTargetPath(cf.getTargetPath());
		ef.setPkg(this.packageDAO.findByName(cf.getPkg()));
		
		ef.setDependentServices(new ArrayList<EService>());
		for (String serviceDep : cf.getDependentServices()) {
			EService service = this.serviceDAO.findByName(serviceDep);
			if (service != null) {
				ef.getDependentServices().add(service);
			}
		}
		
		ef.setTemplates(new ArrayList<ETemplate>());
		for (String templateName : cf.getTemplates()) {
			ETemplate template = this.templateDAO.findByName(templateName);
			if (template != null) {
				ef.getTemplates().add(template);
			}
		}
		return ef;
	}
	
	private EDirectory fillFields(EDirectory edir, Directory dir) {
		edir.setName(dir.getName());
		edir.setFileMode(dir.getFileMode());
		edir.setGroup(dir.getGroup());
		edir.setOwner(dir.getOwner());
		edir.setTargetPath(dir.getTargetPath());
		edir.setPkg(this.packageDAO.findByName(dir.getPkg()));
		edir.setDependentServices(new ArrayList<EService>());
		for (String serviceDep : dir.getDependentServices()) {
			EService service = this.serviceDAO.findByName(serviceDep);
			if (service != null) {
				edir.getDependentServices().add(service);
			}
		}
		return edir;
	}
	
	private EFileData fillFields(EFileData edata, String data) {
		edata.setData(data);
		return edata;
	}
	
	/**
	 * 
	 * @param data the data for which to compute the checksum
	 * @return the checksum
	 */
	public String createChecksum(String data) {
		try {
			byte[] array = MessageDigest.getInstance("MD5").digest(data.getBytes("UTF-8"));
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < array.length; ++i) {
				sb.append(Integer.toHexString((array[i] & 0xFF) | 0x100).substring(1, 3));
			}
			return sb.toString();
		} catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
			// should never happen, if it does-> leave checksum empty
		}
		return null;
	}
	
}
