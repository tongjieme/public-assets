# what is failed over
# backup 
- logical backup
- phisical backup
  online backup
    replica, 
    Continuous Archiving and Point-in-Time Recovery (PITR) https://www.postgresql.org/docs/9.1/continuous-archiving.html
  


# production backup
continuous archiving and PITR

# Online backup
- continuous archiving
-   copy the wal files to another save location
- point in time recovery
  sunday's full backup + monday's wal (like 10am)
# Low Level API Backup
- pg_start_backup('label', false, false) -> generate the base(full) backup

#
