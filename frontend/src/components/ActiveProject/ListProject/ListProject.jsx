import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectList, deleteProjectById } from '../../../redux/actions/projectActions';
import { fetchLeadById } from '../../../redux/actions/leadActions';
import Navbar from '../../HomePage/Navbar';
import style from './ListProject.module.css';
import { HiDotsHorizontal } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../../Context/ProjectContext';

const ListProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData?._id;

  const { fetchProjectDetails } = useProjectContext();

  const handleProjectClick = (projectId) => {
    fetchProjectDetails(projectId);
    navigate('/project');
  };

  const { projects, loading, error } = useSelector((state) => state.projects);
  const { lead, leadLoading, leadError } = useSelector((state) => state.lead);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [leadNames, setLeadNames] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.Project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchProjectList());
  }, [dispatch]);

  useEffect(() => {
    const fetchAllLeads = async () => {
      const uniqueLeadIds = [...new Set(projects.map((project) => project.createdBy))];
      for (const createdBy of uniqueLeadIds) {
        if (createdBy) {
          dispatch(fetchLeadById(createdBy));
        }
      }
    };

    fetchAllLeads();
  }, [projects, dispatch]);

  useEffect(() => {
    if (lead) {
      setLeadNames((prevLeadNames) => ({
        ...prevLeadNames,
        [lead._id]: lead.fullName
      }));
    }
  }, [lead]);

  const handleToggleDropdown = (projectId) => {
    setActiveDropdown(activeDropdown === projectId ? null : projectId);
  };

  const handleBlurDropdown = () => {
    setActiveDropdown(null);
  };

  const deleteProject = (projectId, projectCreatedBy) => {
    
    if (userId !== projectCreatedBy) {
      alert('You are not the lead. Only the project lead can delete this project.');
      return; 
    }

    
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProjectById(projectId));
    }
  };

  if (loading || leadLoading) return <p>Loading...</p>;
  if (error || leadError) return <p>Error: {error || leadError}</p>;

  return (
    <div className={style.con}>
      <div className={style.nav}>
        <Navbar />
      </div>

      <div className={style.body}>
        <div className={style.topcon}>
          <h2>Projects</h2>
          <div>
            <button className={style.createButton} onClick={() => navigate('/create-project')}>Create Project</button>
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder='Search projects..'
            className={style.ip}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={style.procon}>
          <div className={style.prohead}>
            <p className={style.tableb}>Name</p>
            <p className={style.tableb}>Key</p>
            <p className={style.tableb}>Lead</p>
            <p className={style.tablebend}>More Actions</p>
          </div>
          <hr />

          {filteredProjects.length === 0 ? (
            <p className={style.noProjects}>No projects found</p>
          ) : (
            <div className={style.tablebcon}>
              {filteredProjects.map((project) => (
                <div key={project._id} className={style.conheight}>
                  <div className={style.probody}>
                    <p className={style.tablebon} onClick={() => handleProjectClick(project._id)}>
                      {project.Project_name.charAt(0).toUpperCase() + project.Project_name.slice(1).toLowerCase()}
                    </p>
                    <p className={style.tableb}>{project.Key}</p>
                    <p className={style.tablebo}>
                      {leadNames[project.createdBy]
                        ? leadNames[project.createdBy].charAt(0).toUpperCase() + leadNames[project.createdBy].slice(1).toLowerCase()
                        : 'Loading...'}
                    </p>

                    <div
                      className={style.moreActions}
                      tabIndex={0} 
                      onBlur={handleBlurDropdown}  
                    >
                      <HiDotsHorizontal
                        className={`${style.tableb} ${style.del}`}
                        onClick={() => handleToggleDropdown(project._id)}
                      />

                      {activeDropdown === project._id && (
                        <div className={style.dropdown}>
                          <p onClick={() => deleteProject(project._id, project.createdBy)}>Delete</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListProject;
