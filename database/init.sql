-- Schema of record for casproject.
--
-- Applied by the postgres image from /docker-entrypoint-initdb.d ONLY when the
-- data directory is empty, i.e. on a brand-new environment. It does not run
-- against an existing volume, so editing it never mutates a live database.
--
-- This file is authoritative because application.yml sets ddl-auto: validate.
-- Hibernate will no longer create or alter anything: if an entity and this
-- schema disagree, the backend refuses to start. Change an entity => change
-- this file in the same commit, and hand-write the ALTER for environments that
-- already exist.
--
-- Dumped from the live production database 2026-08-18 (pg_dump --schema-only).
-- This repo previously had no schema file at all: the production schema existed
-- only because ddl-auto: update created it, so a fresh environment had no
-- defined starting point. Every live table is backed by an entity here - unlike
-- space-multi, this database carries no orphans.

CREATE TABLE public.certificate (
    id bigint NOT NULL,
    file_path character varying(255),
    course_id bigint,
    user_id uuid
);

CREATE SEQUENCE public.certificate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.certificate_id_seq OWNED BY public.certificate.id;

CREATE TABLE public.course (
    id bigint NOT NULL,
    date date,
    materials character varying(255),
    name character varying(255),
    status character varying(255)
);

CREATE SEQUENCE public.course_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.course_id_seq OWNED BY public.course.id;

CREATE TABLE public.enrollment (
    id bigint NOT NULL,
    status character varying(255),
    course_id bigint,
    user_id uuid
);

CREATE SEQUENCE public.enrollment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.enrollment_id_seq OWNED BY public.enrollment.id;

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    roles character varying(255),
    CONSTRAINT user_roles_roles_check CHECK (((roles)::text = ANY ((ARRAY['ROLE_USER'::character varying, 'ROLE_ADMIN'::character varying])::text[])))
);

CREATE TABLE public.users (
    id uuid NOT NULL,
    created_at timestamp with time zone,
    email character varying(255) NOT NULL,
    last_login timestamp with time zone,
    password character varying(255) NOT NULL,
    username character varying(255) NOT NULL
);

ALTER TABLE ONLY public.certificate ALTER COLUMN id SET DEFAULT nextval('public.certificate_id_seq'::regclass);

ALTER TABLE ONLY public.course ALTER COLUMN id SET DEFAULT nextval('public.course_id_seq'::regclass);

ALTER TABLE ONLY public.enrollment ALTER COLUMN id SET DEFAULT nextval('public.enrollment_id_seq'::regclass);

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT certificate_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT enrollment_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT fk4x08no2mpupkr616h50w3aksx FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.enrollment
    ADD CONSTRAINT fkbhhcqkw1px6yljqg92m0sh2gt FOREIGN KEY (course_id) REFERENCES public.course(id);

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT fkhfh9dx7w3ubf1co1vdev94g3f FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT fknnm153gu9kaknjb58euxms2uk FOREIGN KEY (course_id) REFERENCES public.course(id);

ALTER TABLE ONLY public.certificate
    ADD CONSTRAINT fktnnj9ktwn18vtvap4yuptwxhg FOREIGN KEY (user_id) REFERENCES public.users(id);
