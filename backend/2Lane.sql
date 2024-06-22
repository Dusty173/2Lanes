DROP DATABASE twolane;
CREATE DATABASE twolane;
\connect twolane

\i 2Laneschema.sql

DROP DATABASE twolane-test;
CREATE DATABASE twolane-test;
\connect test

\i 2Laneschema.sql